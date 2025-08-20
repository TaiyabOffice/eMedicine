using System;
using System.Data;
using System.Web;
using Microsoft.Reporting.WebForms;

namespace eMedicineWeb.Reports
{
    public partial class ReportViewerRDLCDS05 : System.Web.UI.Page
    {
        private System.Data.DataSet ds, ds1;
        private DataTable dt1;
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                var exp = "";

                if (Request.QueryString["exp"] != null)
                {
                    exp = Request.QueryString["exp"];
                }

                var reportPram = (dynamic)HttpContext.Current.Session["ReportParam"];

                GenerateReportDocument(reportPram, exp);
            }
        }

        private void ShowErrorMessage()
        {
            RdlcReportViewer.LocalReport.DataSources.Clear();
            RdlcReportViewer.LocalReport.DataSources.Add(new ReportDataSource("", new DataTable()));
            RdlcReportViewer.LocalReport.ReportPath = Server.MapPath("~/") + "Reports//rptRDLC//rpt_blank.rdlc";

            //-to show message in report viewer
            RdlcReportViewer.DataBind();
            RdlcReportViewer.LocalReport.Refresh();
        }

        private void GenerateReportDocument(dynamic reportPram, string exp)
        {
            ds = new DataSet();
            ds = reportPram.DataSetSource;
            string dsName = reportPram.DataSetName;
            string dsName02 = reportPram.DataSetName02;
            string dsName03 = reportPram.DataSetName03;
            string dsName04 = reportPram.DataSetName04;
            string dsName05 = reportPram.DataSetName05;
            RdlcReportViewer.LocalReport.DataSources.Clear();
            RdlcReportViewer.LocalReport.DataSources.Add(new ReportDataSource(dsName, ds.Tables[0]));
            //if (dsName02.Length > 0)
            //    RdlcReportViewer.LocalReport.DataSources.Add(new ReportDataSource(dsName02, ds.Tables[1]));
            //if (dsName03.Length > 0)
            //    RdlcReportViewer.LocalReport.DataSources.Add(new ReportDataSource(dsName03, ds.Tables[2]));
            //if (dsName04.Length > 0)
            //    RdlcReportViewer.LocalReport.DataSources.Add(new ReportDataSource(dsName04, ds.Tables[3]));
            //if (dsName05.Length > 0)
            //    RdlcReportViewer.LocalReport.DataSources.Add(new ReportDataSource(dsName05, ds.Tables[4]));

            if (!string.IsNullOrEmpty(dsName02) && ds.Tables.Count > 1)
            {
                RdlcReportViewer.LocalReport.DataSources.Add(new ReportDataSource(dsName02, ds.Tables[1]));
            }
            if (!string.IsNullOrEmpty(dsName03) && ds.Tables.Count > 2)
            {
                RdlcReportViewer.LocalReport.DataSources.Add(new ReportDataSource(dsName03, ds.Tables[2]));
            }
            if (!string.IsNullOrEmpty(dsName04) && ds.Tables.Count > 2)
            {
                RdlcReportViewer.LocalReport.DataSources.Add(new ReportDataSource(dsName03, ds.Tables[2]));
            }
            if (!string.IsNullOrEmpty(dsName05) && ds.Tables.Count > 2)
            {
                RdlcReportViewer.LocalReport.DataSources.Add(new ReportDataSource(dsName03, ds.Tables[2]));
            }

            RdlcReportViewer.LocalReport.ReportPath = Server.MapPath("~/") + "Reports//" + reportPram.RptFolder + "//" + reportPram.RptFileName;

            RdlcReportViewer.DataBind();
            RdlcReportViewer.LocalReport.Refresh();

            if (exp.Length > 0)
                Export(exp);
        }


        protected void Export(string exp)
        {
            Warning[] warnings;
            string[] streamIds;
            string contentType;
            string encoding;
            string extension;
            string _filename = exp + System.DateTime.Now.ToString("ddMMyyyy");
            // "WORD", "EXCEL", "PDF", "IMAGE"


            //Export the RDLC Report to Byte Array.
            byte[] bytes = RdlcReportViewer.LocalReport.Render(exp, null, out contentType, out encoding, out extension, out streamIds, out warnings);

            //Download the RDLC Report in Word, Excel, PDF and Image formats.
            Response.Clear();
            Response.Buffer = true;
            Response.Charset = "";
            Response.Cache.SetCacheability(HttpCacheability.NoCache);
            Response.ContentType = exp.ToUpper() == "PDF" ? "application/pdf" : contentType;
            //use for download
            if (exp.ToUpper() != "PDF")
                Response.AppendHeader("Content-Disposition", "attachment; filename=" + _filename + "." + extension);
            Response.BinaryWrite(bytes);
            Response.Flush();
            Response.End();
        }


    }
}