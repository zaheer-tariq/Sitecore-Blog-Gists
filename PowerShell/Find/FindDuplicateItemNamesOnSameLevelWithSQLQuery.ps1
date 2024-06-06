$sql = @"
    USE [{0}]
    SELECT Name, ParentID, COUNT(*) as count
    FROM Items GROUP BY Name, ParentID
    HAVING COUNT(*) > 1
    order by ParentID
"@

Import-Function Invoke-SqlCommand

$connection = [Sitecore.Configuration.Settings]::GetConnectionString("master")
$builder = New-Object System.Data.SqlClient.SqlConnectionStringBuilder $connection
$dbName = $builder.InitialCatalog
$query = [string]::Format($sql, $dbName)

Invoke-SqlCommand -Connection $connection -Query $query