<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ReportViewerRDLCDS05.aspx.cs" Inherits="eMedicineWeb.Reports.ReportViewerRDLCDS05" %>

<%@ Register Assembly="Microsoft.ReportViewer.WebForms, Version=11.0.0.0, Culture=neutral, PublicKeyToken=89845dcd8080cc91" Namespace="Microsoft.Reporting.WebForms" TagPrefix="rsweb" %>
<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
      <link href="../Images/p.jpg" rel="shortcut icon" type="image/x-icon" />
</head>
<body>
    <form id="form1" runat="server">
        <div>
            <asp:ScriptManager ID="ScriptManager1" runat="server"></asp:ScriptManager>

            <rsweb:ReportViewer ID="RdlcReportViewer" runat="server" Width="100%" Height="618px" ShowRefreshButton="False"></rsweb:ReportViewer>
        </div>
    </form>
</body>
</html>
