$itemPath = "master:/sitecore/content/Settings/Products"
$rootItem = Get-Item -Path $itemPath
$rootItem.Axes.GetDescendants() | Initialize-Item | 
    Group-Object { $_.ItemPath} | 
    Where-Object { $_.Count -gt 1 } |
    Sort-Object -Property Count -Descending | 
    Select-Object -Property Count, Name

Write-Output "All Done..."