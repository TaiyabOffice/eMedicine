using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;
using System.Net;
using System.Web;
using System.Web.Mvc;
using System.Data;
using System.Net.Http;
using eMedicineWeb.Models;
using Newtonsoft.Json;
using System.Text;
using System.Threading.Tasks;
using System.Web.UI.WebControls;
using System.Configuration;

namespace eMedicineWeb.Controllers
{
    public class LoginController : Controller
    {
        // GET: Company
        private DataSet ds;      
        public DataSet MenuData = new DataSet();
        Uri baseAddress = new Uri(ConfigurationManager.AppSettings["ServerURL"]+ "LoginAPI");
        HttpClient client;
        public LoginController()
        {
            client = new HttpClient();
            client.BaseAddress = baseAddress;

        }
        // GET: Login
        public ActionResult Login()
        {
            return View();
        }
        [HttpPost]
        public ActionResult Login(string UserName, string UserPassword)
        {
            bool status = false;
            string a = GetVisitorDetails();
            string b = GetMachineNameUsingIPAddress(a);
            LoginViewModel loginModel = null;
            string requestUrl = $"{client.BaseAddress}/LogIn?UserName={Uri.EscapeDataString(UserName)}&UserPassword={Uri.EscapeDataString(UserPassword)}";

            HttpResponseMessage response = client.GetAsync(requestUrl).Result;

            if (response.IsSuccessStatusCode)
            {
                string data = response.Content.ReadAsStringAsync().Result;
                var loginResponse = JsonConvert.DeserializeObject<LoginResponse>(data);
                try
                {                                     
                    if (loginResponse.Success)
                    {                        
                        List<LoginViewModel> loginViewModels = loginResponse?.Data ?? new List<LoginViewModel>();
                        loginModel = loginViewModels.FirstOrDefault();                        
                        Session["UserID"] = loginModel.UserId;
                        Session["UserName"] = loginModel.UserName;
                        Session["Email"] = loginModel.Email;
                        Session["PhoneNumber"] = loginModel.PhoneNumber;                       
                        Session["TerminalId"] = b.ToUpper();
                        Session["UserIPc"] = a.ToString();
                        Session["DateToday"] = DateTime.Now.ToString("dd-MM-yyyy");
                        GetMenuById(loginModel.UserId);
                        status = true;
                    }
                    else
                    {
                        status = false;
                    }
                }
                catch (JsonSerializationException)
                {

                    List<LoginViewModel> loginViewModels = loginResponse?.Data ?? new List<LoginViewModel>();
                    loginModel = loginViewModels.FirstOrDefault();                    
                }
            }

            return Json(status, JsonRequestBehavior.AllowGet);
        }

        public void GetMenuById(string UserId)
        {         
            try
            {  
               HttpResponseMessage response = client.GetAsync(client.BaseAddress + "/GetMenuById/" + UserId).Result;

                if (response.IsSuccessStatusCode)                
                {
                    Session["MenuData"] = null;
                    string data = response.Content.ReadAsStringAsync().Result;
                    var menuResponse = JsonConvert.DeserializeObject<MenuResponse>(data);                    
                    if (menuResponse.Success)
                    {
                        List<MenuViewModel> menuLists = menuResponse?.Data ?? new List<MenuViewModel>();
                        //var menuLists = JsonConvert.DeserializeObject<List<MenuViewModel>>(data);
                        DataTable menuTable = ConvertListToDataTable(menuLists);

                        // Add the DataTable to a DataSet
                        DataSet ds = new DataSet();
                        ds.Tables.Add(menuTable);

                        Session["MenuData"] = ds;
                    }
                    else
                    {
                        Session["MenuData"] = null;
                    }
                }                
            }
            catch (Exception ex)
            {              
                ModelState.AddModelError(string.Empty, $"An error occurred: {ex.Message}");
            } 
        }

        internal string GetVisitorDetails()
        {
            string address = "";
            string varIPAddress = string.Empty;
            string varVisitorCountry = string.Empty;
            string varIpAddress = string.Empty;
            varIpAddress = System.Web.HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];
            if (string.IsNullOrEmpty(varIpAddress))
            {
                if (System.Web.HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"] != null)
                {
                    varIpAddress = System.Web.HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];
                }
            }

            //varIPAddress = (System.Web.UI.Page)Request.ServerVariables["HTTP_X_FORWARDED_FOR"];
            if (varIPAddress == "" || varIPAddress == null)
            {
                if (System.Web.HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"] != null)
                {
                    varIpAddress = System.Web.HttpContext.Current.Request.ServerVariables["REMOTE_ADDR"];
                }
            }

            if (string.IsNullOrEmpty(varIpAddress) || varIpAddress.Trim() == "::1")
            {
                var addresses = Dns.GetHostEntry(Dns.GetHostName()).AddressList.FirstOrDefault(x => x.AddressFamily == AddressFamily.InterNetwork);
                if (addresses == null)
                {
                    varIpAddress = String.Empty;
                }
                else
                {
                    varIpAddress = addresses.ToString();
                }
            }
            return varIpAddress;
        }
        internal string GetMachineNameUsingIPAddress(string varIpAdress)
        {
            string machineName = string.Empty;
            try
            {
                IPHostEntry hostEntry = Dns.GetHostEntry(varIpAdress);

                machineName = hostEntry.HostName;
            }
            catch (Exception ex)
            {
                // Machine not found...
            }
            return machineName;
        }
        public static DataTable ConvertListToDataTable<T>(List<T> list)
        {
            DataTable dataTable = new DataTable(typeof(T).Name);

            // Get all properties for the class T
            var properties = typeof(T).GetProperties();
            foreach (var prop in properties)
            {
                // Define each column with the property name and type
                dataTable.Columns.Add(prop.Name, Nullable.GetUnderlyingType(prop.PropertyType) ?? prop.PropertyType);
            }

            foreach (var item in list)
            {
                var values = new object[properties.Length];
                for (int i = 0; i < properties.Length; i++)
                {
                    values[i] = properties[i].GetValue(item, null);
                }
                dataTable.Rows.Add(values);
            }

            return dataTable;
        }
    }
}