function Get-ItemUrl($itemToProcess){
     [Sitecore.Context]::SetActiveSite("website")
     $urlop = New-Object ([Sitecore.Links.UrlOptions]::DefaultOptions)
     $urlop.AddAspxExtension = $false
     $urlop.AlwaysIncludeServerUrl = $true
     $linkUrl = [Sitecore.Links.LinkManager]::GetItemUrl($itemToProcess,$urlop)
     $linkUrl
}

$Results = @();

$allItems = Get-ChildItem -Path 'master://sitecore/content/STBCom/Content/Redirects' -Recurse
$allItems | ForEach-Object {
 
	$currentItem = $_
	
	if ($currentItem.TemplateName -match 'Redirect Folder' )
	{
		return;
	}
  
    $redirectItemPath = "";
    
    if ($currentItem["redirectItem"] -ne "")
    {
        $redirectItem = Get-Item -Path "master:" -ID $currentItem["redirectItem"]
    		
    	if ($redirectItem)
    	{
    		$redirectItemPath = Get-ItemUrl($redirectItem)
    	}
    }

 
	$Properties = @{
		ID = $currentItem.ID
		Path = $currentItem.FullPath
		SourceUrl = $currentItem["sourceUrl"]
		RedirectItemPath = $redirectItemPath
		RedirectUrl = $currentItem["redirectUrl"]
		IsPermanent = $currentItem["isPermanent"]
	}

	$Results += New-Object psobject -Property $Properties
}

$Results | Show-ListView