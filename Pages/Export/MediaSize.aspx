<%@ Page Language="C#" AutoEventWireup="true" Inherits="System.Web.UI.Page" %>

<%@ Import Namespace="Sitecore.Data" %>
<%@ Import Namespace="Sitecore.Data.Items" %>
<%@ Import Namespace="Sitecore.Resources.Media" %>
<%@ Import Namespace="System.Collections.Generic" %>
<%@ Import Namespace="System.Linq" %>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>Sitecore Media Library Size Calculator</title>
</head>
<body>
    <h1>Calculate Media Library Size</h1>
    <form id="form1" runat="server">
        <table>
            <tr>
                <td>
                    <label for="database">Database (e.g., master):</label>
                </td>
                <td>
                    <asp:TextBox ID="databaseTextBox" Width="500px" Text="master" runat="server"></asp:TextBox>
                </td>
            </tr>
            <tr>
                <td>
                    <label for="mediaRootPathTextBox">Media Library Root Path(s):</label>
                </td>
                <td>
                    <asp:TextBox ID="mediaRootPathTextBox" Width="500px" Rows="5" TextMode="MultiLine" 
                                 Text="/sitecore/media library" runat="server"></asp:TextBox>
                </td>
            </tr>
        </table>
        <br />
        <button type="submit" runat="server" onserverclick="CalculateMediaLibrarySize_Click">Calculate Size</button>
    </form>
    <br />
    <asp:Literal ID="ltResult" runat="server"></asp:Literal>
</body>
</html>

<script runat="server">
    protected void CalculateMediaLibrarySize_Click(object sender, EventArgs e)
    {
        string databaseName = databaseTextBox.Text.Trim();
        string rawPaths = mediaRootPathTextBox.Text.Trim();

        if (string.IsNullOrEmpty(databaseName) || string.IsNullOrEmpty(rawPaths))
        {
            ltResult.Text = "<p class='error'>Please provide the Database and at least one Media Library Root Path.</p>";
            return;
        }

        try
        {
            Database db = Sitecore.Configuration.Factory.GetDatabase(databaseName);
            string[] paths = rawPaths.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
            List<string> results = new List<string>();

            foreach (string path in paths)
            {
                string trimmedPath = path.Trim();
                Item mediaRoot = db.GetItem(trimmedPath);

                if (mediaRoot == null)
                {
                    results.Add(string.Format("<p class='error'>Media root not found at: {0}</p>", trimmedPath));
                    continue;
                }

                long totalSize = CalculateMediaSize(mediaRoot);
                results.Add(string.Format("<p class='success'>Size for <strong>{0}</strong>: {1}</p>", trimmedPath, FormatSize(totalSize)));
            }

            ltResult.Text = string.Join("<br/>", results.ToArray());
        }
        catch (Exception ex)
        {
            ltResult.Text = string.Format("<p class='error'>An error occurred while calculating size: {0}</p>", ex.Message);
        }
    }

    private long CalculateMediaSize(Item rootItem)
    {
        long totalSize = 0;
        IEnumerable<Item> mediaItems = rootItem.Axes.GetDescendants().Where(IsMediaItem);

        foreach (Item mediaItem in mediaItems)
        {
            MediaItem media = new MediaItem(mediaItem);
            totalSize += media.Size;
        }

        return totalSize;
    }

    private bool IsMediaItem(Item item)
    {
        return MediaManager.GetMedia(item) != null;
    }

    private string FormatSize(long bytes)
    {
        const double KB = 1024;
        const double MB = KB * 1024;
        const double GB = MB * 1024;

        if (bytes >= GB)
            return string.Format("{0:F2} GB", bytes / GB);
        else if (bytes >= MB)
            return string.Format("{0:F2} MB", bytes / MB);
        else if (bytes >= KB)
            return string.Format("{0:F2} KB", bytes / KB);
        else
            return string.Format("{0} Bytes", bytes);
    }
</script>
