Get-ChildItem -Path "master:/sitecore/content/Settings/Products" -Recurse | Foreach-Object{
	$id = $_.ID
	$item = Get-Item -Path master: -ID $id
	Write-Output "Checking item $($item.Name)"
	$index = 1
	Get-ChildItem -Path $item.Parent.Paths.FullPath | Where-Object{ $_.ID.Guid -ne $id.Guid -and $_.Name -eq $item.Name } | Foreach-Object {
		$newName = -Join($_.Name, " ", $index)
		Write-Host "$($_.Name) will be renamed to $newName" 
		$_.Editing.BeginEdit()
		$_.Name = $newName
		$_.Editing.EndEdit()
		$index++
	}
}
Write-Output "All Done..."
