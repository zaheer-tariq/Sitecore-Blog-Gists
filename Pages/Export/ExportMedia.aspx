<%@ Page Language="C#" AutoEventWireup="true" Inherits="System.Web.UI.Page" %>
 
<%@ Import Namespace="Sitecore.Data" %>
<%@ Import Namespace="Sitecore.Data.Items" %>
<%@ Import Namespace="Sitecore.Resources.Media" %>
<%@ Import Namespace="Sitecore.Configuration" %>
<%@ Import Namespace="System.Collections.Generic" %>
<%@ Import Namespace="System.IO" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>Sitecore Media Export</title>
</head>
<body>
    <h1>Export Media Library Files</h1>
    <form id="form1" runat="server">
        <table>
            <tr>
                <td>
                    <label for="mediaPath">Media Library Path:</label>
                </td>
                <td>
                    <asp:TextBox ID="mediaPathTextBox" Width="500px" Text="/sitecore/media library" runat="server"></asp:TextBox>
                </td>
            </tr>
            <tr>
                <td>
                    <label for="database">Database (e.g., master):</label>
                </td>
                <td>
                    <asp:TextBox ID="databaseTextBox" Width="300px" Text="master" runat="server"></asp:TextBox>
                </td>
            </tr>
            <tr>
                <td>
                    <label for="includePaths">Paths to Include (one per line):</label>
                </td>
                <td>
                    <asp:TextBox ID="includePathsTextBox" TextMode="MultiLine" Rows="5" Width="500px" runat="server"></asp:TextBox>
                </td>
            </tr>
            <tr>
                <td>
                    <label for="exportChildrenOnly">Export Only Children:</label>
                </td>
                <td>
                    <asp:CheckBox ID="exportChildrenOnlyCheckBox" runat="server" />
                </td>
            </tr>
            <tr>
                <td>
                    <label for="recursiveDelete">Recursive Delete:</label>
                </td>
                <td>
                    <asp:CheckBox ID="recursiveDeleteCheckBox" runat="server" />
                </td>
            </tr>
        </table>
        <br />
        <button type="submit" runat="server" onserverclick="ExportMediaLibrary_Click">Export Media Library</button>
        <br />
        <br />
        <button type="button" runat="server" onserverclick="CleanupExportsFolder_Click">Cleanup Exports Folder</button>
    </form>
    <br />
    <asp:Literal ID="ltResult" runat="server"></asp:Literal>
</body>
</html>
<script runat="server">
    protected void CleanupExportsFolder_Click(object sender, EventArgs e)
    {
        try
        {
            string exportDirectory = Server.MapPath("/App_Data/Export/MediaLibrary");
            bool recursiveDelete = recursiveDeleteCheckBox.Checked;
 
            if (Directory.Exists(exportDirectory))
            {
                if (recursiveDelete)
                {
                    Directory.Delete(exportDirectory, true);
                    ltResult.Text = "<p class='success'>Exports folder and all contents deleted recursively.</p>";
                }
                else
                {
                    string[] files = Directory.GetFiles(exportDirectory);
                    foreach (string file in files)
                    {
                        File.Delete(file);
                    }
                    ltResult.Text = "<p class='success'>Exports folder cleaned up (files only).</p>";
                }
            }
            else
            {
                ltResult.Text = "<p class='error'>Exports folder does not exist.</p>";
            }
        }
        catch (Exception ex)
        {
            ltResult.Text = "<p class='error'>An error occurred while cleaning up the exports folder: " + ex.Message + "</p>";
        }
    }
 
    protected void ExportMediaLibrary_Click(object sender, EventArgs e)
    {
        string mediaPath = mediaPathTextBox.Text.Trim();
        string databaseName = databaseTextBox.Text.Trim();
        string includePathsRaw = includePathsTextBox.Text;
        bool exportChildrenOnly = exportChildrenOnlyCheckBox.Checked;
 
        List<string> includePaths = new List<string>();
        if (!string.IsNullOrWhiteSpace(includePathsRaw))
        {
            includePaths.AddRange(includePathsRaw.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries));
        }
 
        if (string.IsNullOrEmpty(mediaPath) || string.IsNullOrEmpty(databaseName))
        {
            ltResult.Text = "<p class='error'>Please provide Media Library Path and Database.</p>";
            return;
        }
 
        if (includePaths.Count == 0)
        {
            ltResult.Text = "<p class='error'>Please specify at least one path to include.</p>";
            return;
        }
 
        Database db = Factory.GetDatabase(databaseName);
        Item rootMediaItem = db.GetItem(mediaPath);
 
        if (rootMediaItem == null)
        {
            ltResult.Text = string.Format("<p class='error'>Media Library path not found: {0}</p>", mediaPath);
            return;
        }
 
        try
        {
            ExportMediaItems(rootMediaItem, includePaths, exportChildrenOnly);
            ltResult.Text += "<p class='success'>Export completed.</p>";
        }
        catch (Exception ex)
        {
            ltResult.Text = string.Format("<p class='error'>An error occurred: {0}</p>", ex.Message);
        }
    }
 
    private void ExportMediaItems(Item rootItem, List<string> includePaths, bool exportChildrenOnly)
    {
        string exportDirectory = Server.MapPath("/App_Data/Export/MediaLibrary");
 
        if (!Directory.Exists(exportDirectory))
        {
            Directory.CreateDirectory(exportDirectory);
        }
 
        IEnumerable<Item> itemsToExport;
        if (exportChildrenOnly)
            itemsToExport = rootItem.Children;
        else
            itemsToExport = rootItem.Axes.GetDescendants();
 
        foreach (Item childItem in itemsToExport)
        {
            if (childItem.TemplateName.ToLower().Contains("folder"))
                continue;
 
            if (!includePaths.Exists(path => childItem.Paths.Path.StartsWith(path, StringComparison.OrdinalIgnoreCase)))
                continue;
 
            try
            {
                ExportMediaItem(childItem, exportDirectory);
            }
            catch (Exception ex)
            {
                ltResult.Text += string.Format("<p class='error'>Failed to export {0}: {1}</p>", childItem.Paths.Path, ex.Message);
            }
        }
    }
 
    private void ExportMediaItem(Item mediaItem, string exportDirectory)
    {
        var media = new MediaItem(mediaItem);
        string mediaPath = mediaItem.Paths.Path.Substring(mediaItem.Paths.Path.IndexOf("/media library") + 1);
        string relativePath = mediaPath.Replace("Media Library", string.Empty).Trim('/');
        string folderPath = Path.Combine(exportDirectory, Path.GetDirectoryName(relativePath));
 
        if (!Directory.Exists(folderPath))
        {
            Directory.CreateDirectory(folderPath);
        }
 
        string fileName = mediaItem.Name;
        string fileExtension = media.Extension;
 
        if (string.IsNullOrEmpty(fileExtension))
        {
            fileExtension = "na";
        }
 
        string fullFilePath = Path.Combine(folderPath, string.Format("{0}.{1}", fileName, fileExtension));
 
        if (File.Exists(fullFilePath))
        {
            return;
        }
 
        using (Stream fileStream = media.GetMediaStream())
        {
            if (fileStream != null)
            {
                using (var file = new FileStream(fullFilePath, FileMode.Create, FileAccess.Write))
                {
                    fileStream.CopyTo(file);
                }
                ltResult.Text += string.Format("<p class='success'>Exported: {0}</p>", fullFilePath);
            }
            else
            {
                ltResult.Text += string.Format("<p class='error'>Failed to export (no stream): {0}</p>", fullFilePath);
            }
        }
    }
</script>
