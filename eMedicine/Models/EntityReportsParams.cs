using System.Data;

namespace eMedicine.Models
{
    public class EntityReportsParams
    {
        public string RptCallName { get; set; }
        public string RptFileName { get; set; }
        public string ReportTitle { get; set; }
        public string ReportSubTitle { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public DateTime Date { get; set; }
        public string Status { get; set; }
        public string ReportType { get; set; }
        public Int32 CompanyId { get; set; }
        public string CompanyName { get; set; }
        public DataSet DataSetSource { get; set; }
        public DataTable DataTableSource { get; set; }
        public bool IsSubReport { get; set; }
        public dynamic SubReportDataSources { get; set; }
        public bool IsPassParamToCr { get; set; }
        public string DataSetName { get; set; }
        public string DataSetName02 { get; set; }
        public string DataSetName03 { get; set; }
        public string DataSetName04 { get; set; }
        public string DataSetName05 { get; set; }
        public string DataSetName06 { get; set; }
        public string MachineName { get; set; }
        public string UserName { get; set; }
        public string UserId { get; set; }
        public bool IsNullDataSource { get; set; }
        public string FromDate1 { get; set; }
        public string ToDate1 { get; set; }
        public string RptFolder { get; set; }
    }
}
