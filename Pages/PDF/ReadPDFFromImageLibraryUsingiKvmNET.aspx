<%@ Page Language="C#" %>

<% /*-------------------------------------------------------------------------
    This exmaple is created to run within a Sitecore application.
    Tested with Sitecore 10.3

    To run this example, you must add references to the following
    http://www.squarepdf.net/how-to-convert-pdf-to-text-in-net
    
     - IKVM.OpenJDK.Core.dll
     - IKVM.OpenJDK.SwingAWT.dll
     - pdfbox-1.8.9.dll

    In addition to these libraries, it is necessary to copy the following files to the application directory:

     - commons-logging.dll
     - fontbox-1.8.9.dll
     - IKVM.OpenJDK.Text.dll
     - IKVM.OpenJDK.Util.dll
     - IKVM.Runtime.dll

------------------------------------------------------------------------- */ %>


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
<%@ Import Namespace="org.apache.pdfbox.pdmodel" %>
<%@ Import Namespace="org.apache.pdfbox.util" %>

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


            PDDocument doc = null;
            try
            {
                java.io.InputStream javaStream = new ikvm.io.InputStreamWrapper(mediaStream);
                doc = PDDocument.load(javaStream);
                var stripper = new PDFTextStripper();
                var pdfContent = stripper.getText(doc);
                Response.Write(pdfContent);
            }
            finally
            {
                if (doc != null)
                {
                    doc.close();
                }
            }
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
