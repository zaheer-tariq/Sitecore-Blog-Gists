# ========================
# Configuration Variables
# ========================
$rootPath = "/sitecore/content/Demo/home"
$databaseName = "master"
$excludedItemName = "Page Components"
$workflowFinalStateId = "{SQ6541R7-5ABM-3X45-23V1-Z3E2262EA6F3}"
$searchableFieldName = "searchable"
$disableIndexingFieldName = "Disable Indexing"
$titleFieldName = "Title"
$workflowStateFieldName = "__Workflow state"

# ========================
# Initialization
# ========================
$rootItem = Get-Item -Path $rootPath

if (-not $rootItem) {
    Write-Error "Root item not found at path $rootPath"
    return
}

$db = [Sitecore.Data.Database]::GetDatabase($databaseName)
$results = @()

# ========================
# Processing Descendants
# ========================
$items = $rootItem.Axes.GetDescendants() | Where-Object { $_.TemplateID -ne $null }

foreach ($item in $items) {

    # Skip excluded item by name
    if ($item.Name -eq $excludedItemName) {
        continue
    }

    $hasPresentation = $false

    # Check if item has a presentation layout
    try {
        if ($item.Visualization -and $item.Visualization.Layout -ne $null) {
            $hasPresentation = $true
        }
    } catch {
        # Some items might not support Visualization; ignore errors
    }

    if ($hasPresentation) {

        $workflowField = $item[$workflowStateFieldName]
        $isFinal = ($workflowField -eq $workflowFinalStateId)

        if ($isFinal) {
            # Determine search visibility
            $showInSearch = if ($item[$searchableFieldName] -eq "1") { "Yes" } else { "No" }

            # Determine sitemap inclusion
            $includeInSitemap = if ($item[$disableIndexingFieldName] -eq "1") { "No" } else { "Yes" }

            # Fetch title and URL
            $title = $item[$titleFieldName]
            $url = [Sitecore.Links.LinkManager]::GetItemUrl($item)

            # Add to results
            $results += [PSCustomObject]@{
                ID                = $item.ID.Guid
                Name              = $item.Name
                ShowInSearch      = $showInSearch
                IncludeInSitemap  = $includeInSitemap
                Link              = $url
            }
        }
    }
}

# ========================
# Output Results
# ========================
$results | Select-Object ID, Name, ShowInSearch, IncludeInSitemap, Link | Show-ListView
