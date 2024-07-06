<%@ Page Language="c#" %>

<%@ Import Namespace="System" %>
<%@ Import Namespace="System.Collections" %>
<%@ Import Namespace="System.Configuration" %>
<%@ Import Namespace="System.Data" %>
<%@ Import Namespace="System.Linq" %>
<%@ Import Namespace="System.Web" %>
<%@ Import Namespace="System.Web.Security" %>
<%@ Import Namespace="System.Web.UI" %>
<%@ Import Namespace="System.Web.UI.HtmlControls" %>
<%@ Import Namespace="System.Web.UI.WebControls" %>
<%@ Import Namespace="System.Web.UI.WebControls.WebParts" %>
<%@ Import Namespace="System.Xml.Linq" %>
<%@ Import Namespace="Sitecore.Data.Items" %>
<%@ Import Namespace="System.Collections.Generic" %>
<%@ Import Namespace="Sitecore.Web.UI.WebControls" %>
<%@ Import Namespace="Sitecore.Data.Fields" %>
<%@ Import Namespace="Sitecore.Resources.Media" %>
<%@ Import Namespace="Sitecore.Links" %>
<%@ Import Namespace="Sitecore.Configuration" %>
<%@ Import Namespace="Sitecore.Data" %>
<%@ Import Namespace="Sitecore.SecurityModel" %>
<%@ Import Namespace="System.IO" %>
<%@ Import Namespace="System.Net" %>
<%@ Import Namespace="Sitecore.Collections" %>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >

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
            var path = "/sitecore/content/home/Products";

            int rowNumber = 1;

            Database master = Sitecore.Configuration.Factory.GetDatabase("master");

            Item rootItem = master.GetItem(path, Sitecore.Context.Language);
            if (rootItem == null) throw new Exception(path + " does not exist");

            var allItems = rootItem.Axes.GetDescendants().OrderBy(x => x.Paths.FullPath);
            if (allItems == null || allItems.Count() <= 0) throw new Exception("No Items under this folder");

            Response.Write("<table border='1'>");

            foreach (var item in allItems.Where(x => x.TemplateName.Equals("Product")))
            {
                try
                {
                    Response.Write("<tr>");
                    Response.Write("<td>" + rowNumber + "</td>");
                    Response.Write("<td>" + item.ID.ToString() + "</td>");


                    Response.Write("<td>" + item.DisplayName + "</td>");
                    Response.Write("<td>" + item["shortDescription"] + "</td>");
                    Response.Write("<td>" + item["additionalDescription"] + "</td>");

                    Response.Write("<td>" + item.Paths.FullPath + "</td>");
                    Response.Write("</tr>");
                }
                catch (Exception ex)
                {
                    Response.Write("Error : " + ex.Message + "");
                }

                rowNumber++;
            }

            Response.Write("</table>");
        }
        catch (Exception ex)
        {
            Response.Write(ex.ToString() + ex.StackTrace.ToString());
        }
    }
</script>
<html>
<head>
    <title>Item Report</title>
</head>
<body>
    <form id="Form2" method="post" style="font-weight: bold" runat="server">
        <br />
        <asp:CheckBox ID="ShowEmptyCheckBox" Checked="true" Text="Show only empty results" runat="server" />
        <br />
        <asp:Button ID="GoButton" runat="server" Text="Show Report" OnClientClick="return confirm('Are you sure?');"
            OnClick="GoButton_Click" />
        <br />
        &nbsp;&nbsp;<br />
        <br />
    </form>
</body>
</html>
