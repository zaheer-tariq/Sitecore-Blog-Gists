$SourcePath = "master:/sitecore/content/Demo/home"
$DestinationParentPath = "master:/sitecore/content/Demo/home/Test"
$NewName = "CopyOfHomePage"
$DatasourceFolderName = "Page Components"

$source = Get-Item $SourcePath
$destParent = Get-Item $DestinationParentPath

Write-Host "Starting copy process from: $SourcePath to: $DestinationParentPath"

$existing = Get-Item -Path "$DestinationParentPath/$NewName" -ErrorAction SilentlyContinue
if ($existing) {
    Write-Host "SKIP: Item already exists at destination -> $DestinationParentPath/$NewName"
    return
}

Write-Host "Copying item..."
Copy-Item -Path $source.Paths.FullPath `
          -Destination $destParent.Paths.FullPath `
          -Container

$copied = Get-Item "$DestinationParentPath/$($source.Name)"

Rename-Item -Path $copied.Paths.FullPath -NewName $NewName
$copied = Get-Item "$DestinationParentPath/$NewName"

Write-Host "Renamed copied item to: $NewName"

$dsSource = $source.Children | Where-Object { $_.Name -eq $DatasourceFolderName }

if ($dsSource) {
    Write-Host "Copying datasource folder: $DatasourceFolderName"

    Copy-Item -Path $dsSource.Paths.FullPath `
              -Destination $copied.Paths.FullPath `
              -Recurse
}

$newDsRoot = "$($copied.Paths.FullPath)/$DatasourceFolderName"
$oldDsRoot = "$($source.Paths.FullPath)/$DatasourceFolderName"

Write-Host "Updating rendering datasource references..."

$renderings = Get-Rendering -Item $copied -FinalLayout

$updatedCount = 0

foreach ($r in $renderings) {

    $id = $r.Datasource

    if ([Sitecore.Data.ID]::IsID($id)) {

        $db = [Sitecore.Data.Database]::GetDatabase("master")
        $dsItem = $db.GetItem($id)

        if ($dsItem -and $dsItem.Paths.FullPath -like "$oldDsRoot*") {

            $newPath = $dsItem.Paths.FullPath -replace [regex]::Escape($oldDsRoot), $newDsRoot
            $newItem = $db.GetItem($newPath)

            if ($newItem) {
                Set-Rendering -Item $copied -Instance $r -Datasource $newItem.ID -FinalLayout
                $updatedCount++
            }
        }
    }
}

Write-Host "Renderings updated: $updatedCount datasource reference(s) adjusted."

$homeItem = Get-Item $copied.Paths.FullPath

Write-Host "Validating datasource references under: $($homeItem.Paths.FullPath)"

$legacyCount = 0

Get-Rendering -Item $homeItem -FinalLayout | ForEach-Object {

    $id = $_.Datasource

    if ([Sitecore.Data.ID]::IsID($id)) {

        $dsItem = [Sitecore.Data.Database]::GetDatabase("master").GetItem($id)

        if ($dsItem -and $dsItem.Paths.FullPath -like "$oldDsRoot*") {
            $legacyCount++
        }
    }
}

Write-Host "Validation complete: $legacyCount legacy datasource reference(s) found."
Write-Host "DONE: $NewName successfully created at $($copied.Paths.FullPath)"