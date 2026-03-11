# This PowershShell scripts helps you update solrconfig.xml using Solr Admin API for a Solr instance hosted in Cloud when you do not have access to file system.

#Step 1: Download solrconfig.xml from Solr using the URL below, 
#		 https://mcc-123456-xyz-solr-solr.mcsitecore-deploy.com/solr/sitecoreId_web_index/admin/file?file=solrconfig.xml&wt=raw
#		 Make sure to update the index name and it must be correct as per your environment
#		 Save the file as 'solrconfig.xml', you can simply save in browser by pressing Ctrl + S

#Step 2: Open the downloaded 'solrconfig.xml' and change the maxFields to your desired value e.g. from 2000 to 3000
#		 The new value must be higher than the erorr you got, make sure to Save the file.

#Step 3: Update values in the script below and run it from Windows PowerShell

$SolrUser      = "asjhkasdhs"
$SolrPassword  = "au23jias$sad"
$TargetSolrUrl = "https://mcc-123456-xyz-solr-solr.mcsitecore-deploy.com"

$SolrCredential = New-Object System.Management.Automation.PSCredential `
($SolrUser,(ConvertTo-SecureString $SolrPassword -AsPlainText -Force))

$ConfigName = "sitecoreId_web_index_config" # this must be the name you see in the Solr Admin UI
$ZipFilePath = "C:\Upgrade\solr\solrconfig.xml"

$uploadUrl = "$TargetSolrUrl/solr/admin/configs?action=UPLOAD&name=$ConfigName&filePath=solrconfig.xml&overwrite=true"

$uploadResponse = Invoke-RestMethod -Uri $uploadUrl -Method Post `
    -Credential $SolrCredential `
    -InFile $ZipFilePath `
    -ContentType "application/octet-stream"

Write-Host "Successfully uploaded $ConfigName to Solr"


#Step 4: Reload the Solr Config, by simply opening this URL in brower, make sure to update the index name in the URL
#		 https://mcc-123456-xyz-solr-solr.mcsitecore-deploy.com/solr/admin/collections?action=RELOAD&name=sitecoreId_web_index

#Step 5: Do it for other configs if needed e.g. master or core or custom