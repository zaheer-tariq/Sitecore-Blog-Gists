<%@ Page Language="C#" %>

<%@ Import Namespace="System" %>
<%@ Import Namespace="System.Collections" %>
<%@ Import Namespace="System.Configuration" %>
<%@ Import Namespace="System.Data" %>
<%@ Import Namespace="Sitecore.Data.Items" %>
<%@ Import Namespace="Sitecore.Data.Fields" %>
<%@ Import Namespace="Sitecore.Resources.Media" %>
<%@ Import Namespace="Sitecore.Links" %>
<%@ Import Namespace="Sitecore.Configuration" %>
<%@ Import Namespace="Sitecore.Data" %>
<%@ Import Namespace="System.IO" %>
<%@ Import Namespace="System.Text" %>
<%@ Import Namespace="iTextSharp.text.pdf" %>
<%@ Import Namespace="iTextSharp.text.pdf.parser" %>

<script runat="server">

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!Sitecore.Context.User.IsAdministrator)
        {
            Sitecore.Web.WebUtil.Redirect("/functions/login.aspx");
        }
    }
    
    protected void GoButton_Click(object sender, EventArgs e)
    {
        try
        {
            Database master = Sitecore.Configuration.Factory.GetDatabase("master");

            var item = master.GetItem("/sitecore/content/Home/Test");
            if (item == null) return;

            Sitecore.Data.Fields.FileField fileField = item.Fields["File"];
            Sitecore.Data.Items.Item file = fileField.MediaItem;

            var media = new MediaItem(file);
            var mediaStream = media.GetMediaStream();
            
            var text = new StringBuilder();
            using (PdfReader reader = new PdfReader(mediaStream))
            {
                for (int index = 1; index <= reader.NumberOfPages; index++)
                {
                    text.Append(PdfTextExtractor.GetTextFromPage(reader, index));
                }
            }
            mediaStream.Close();
            
            string pdfContent = text.ToString();
            Response.Write(pdfContent);
        }
        catch (Exception ex)
        {
            Response.Write(ex.ToString() + ex.StackTrace.ToString());
        }
    }

</script>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>

</head>
<body>
    <form id="form1" runat="server">
        <div>
            <br />
            <br />
            <asp:Button ID="GoButton" runat="server" Text="Go" OnClientClick="return confirm('Are you sure?');"
                OnClick="GoButton_Click" />
            <br />
            <br />
        </div>
    </form>
</body>
</html>
