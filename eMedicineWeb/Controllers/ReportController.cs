using eMedicineWeb.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace eMedicineWeb.Controllers
{
    public class ReportController : Controller
    {
        Uri baseAddress = new Uri(ConfigurationManager.AppSettings["ServerURL"] + "ReportAPI");
        HttpClient client;       
        DataSet ds = new DataSet();
        public ReportController()
        {
            client = new HttpClient();
            client.BaseAddress = baseAddress;
            var userAgent = ConfigurationManager.AppSettings["UserAgent"];
            var acceptHeader = ConfigurationManager.AppSettings["AcceptHeader"];
            client = new HttpClient
            {
                BaseAddress = baseAddress
            };
            if (!string.IsNullOrEmpty(userAgent))
            {
                client.DefaultRequestHeaders.Add("User-Agent", userAgent);
            }
            if (!string.IsNullOrEmpty(acceptHeader))
            {
                client.DefaultRequestHeaders.Add("Accept", acceptHeader);
            }
        }
        // GET: Report
        public async Task<ActionResult> PrintReportData(EntityDefaultParameter objReportParameter)
        {            
            if (!ModelState.IsValid)
            {
                return Json(new { success = false, message = "Failed" });
            }

            bool status = false;
            objReportParameter.RptFileName = objReportParameter.RptFileName;
            objReportParameter.DataSetName = objReportParameter.DataSetName;
            objReportParameter.DataSetName02 = objReportParameter.DataSetName02;
            objReportParameter.DataSetName03 = objReportParameter.DataSetName03;
            objReportParameter.DataSetName04 = objReportParameter.DataSetName04;
            objReportParameter.DataSetName05 = objReportParameter.DataSetName05;
            objReportParameter.RptFolder = objReportParameter.RptFolder;

            objReportParameter.COMC1 = objReportParameter.COMC1 == null ? "0" : objReportParameter.COMC1;
            objReportParameter.PROCNAME = objReportParameter.PROCNAME == null ? "0" : objReportParameter.PROCNAME;
            objReportParameter.CALLTYPE = objReportParameter.CALLTYPE == null ? "0" : objReportParameter.CALLTYPE;
            objReportParameter.DESC1 = objReportParameter.DESC1 == null ? "0" : objReportParameter.DESC1;
            objReportParameter.DESC2 = objReportParameter.DESC2 == null ? "0" : objReportParameter.DESC2;
            objReportParameter.DESC3 = objReportParameter.DESC3 == null ? "0" : objReportParameter.DESC3;
            objReportParameter.DESC4 = objReportParameter.DESC4 == null ? "0" : objReportParameter.DESC4;
            objReportParameter.DESC5 = objReportParameter.DESC5 == null ? "0" : objReportParameter.DESC5;
            objReportParameter.DESC6 = objReportParameter.DESC6 == null ? "0" : objReportParameter.DESC6;
            objReportParameter.DESC7 = objReportParameter.DESC7 == null ? "0" : objReportParameter.DESC7;
            objReportParameter.DESC8 = objReportParameter.DESC8 == null ? "0" : objReportParameter.DESC8;
            objReportParameter.DESC9 = objReportParameter.DESC9 == null ? "0" : objReportParameter.DESC9;
            objReportParameter.DESC10 = objReportParameter.DESC10 == null ? "0" : objReportParameter.DESC10;
            objReportParameter.DESC11 = objReportParameter.DESC11 == null ? "0" : objReportParameter.DESC11;
            objReportParameter.DESC12 = objReportParameter.DESC12 == null ? "0" : objReportParameter.DESC12;
            objReportParameter.DESC13 = objReportParameter.DESC13 == null ? "0" : objReportParameter.DESC13;
            objReportParameter.DESC14 = objReportParameter.DESC14 == null ? "0" : objReportParameter.DESC14;
            objReportParameter.DESC15 = objReportParameter.DESC15 == null ? "0" : objReportParameter.DESC15;
            objReportParameter.DESC16 = objReportParameter.DESC16 == null ? "0" : objReportParameter.DESC16;
            objReportParameter.DESC17 = objReportParameter.DESC17 == null ? "0" : objReportParameter.DESC17;
            objReportParameter.DESC18 = objReportParameter.DESC18 == null ? "0" : objReportParameter.DESC18;
            objReportParameter.DESC19 = objReportParameter.DESC19 == null ? "0" : objReportParameter.DESC19;
            objReportParameter.DESC20 = objReportParameter.DESC20 == null ? "0" : objReportParameter.DESC20;
            objReportParameter.DESC21 = objReportParameter.DESC21 == null ? "0" : objReportParameter.DESC21;
            objReportParameter.DESC22 = objReportParameter.DESC22 == null ? "0" : objReportParameter.DESC22;
            objReportParameter.DESC23 = objReportParameter.DESC23 == null ? "0" : objReportParameter.DESC23;
            objReportParameter.DESC24 = objReportParameter.DESC24 == null ? "0" : objReportParameter.DESC24;
            objReportParameter.DESC25 = objReportParameter.DESC25 == null ? "0" : objReportParameter.DESC25;
            objReportParameter.DESC26 = objReportParameter.DESC26 == null ? "0" : objReportParameter.DESC26;
            objReportParameter.DESC27 = objReportParameter.DESC27 == null ? "0" : objReportParameter.DESC27;
            objReportParameter.DESC28 = objReportParameter.DESC28 == null ? "0" : objReportParameter.DESC28;
            objReportParameter.DESC29 = objReportParameter.DESC29 == null ? "0" : objReportParameter.DESC29;
            objReportParameter.DESC30 = objReportParameter.DESC30 == null ? "0" : objReportParameter.DESC30;

            string data = JsonConvert.SerializeObject(objReportParameter);
            StringContent content = new StringContent(data, Encoding.UTF8, "application/json");

            HttpResponseMessage response = await client.PostAsync(client.BaseAddress + "/PrintReportData", content);

            if (response.IsSuccessStatusCode)
            {
                status = true;
                string json = await response.Content.ReadAsStringAsync();                
                var root = JsonConvert.DeserializeObject<JObject>(json);                
                var dataJson = root["data"].ToString();                               
                DataSet ds = JsonConvert.DeserializeObject<DataSet>(dataJson);
                objReportParameter.DataSetSource = ds;
                this.HttpContext.Session["ReportParam"] = objReportParameter;
            }           
            return Json(new { success = status, message = "Failed" });
        }
    }
}