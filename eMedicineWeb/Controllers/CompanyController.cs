using eMedicineWeb.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web;
using System.Web.Mvc;

namespace eMedicineWeb.Controllers
{
    public class CompanyController : Controller
    {
        // GET: Company
        Uri baseAddress = new Uri("https://localhost:44390/api");
        HttpClient client;
        public CompanyController() 
        { 
            client = new HttpClient();
            client.BaseAddress = baseAddress;

        }

        public ActionResult GetAllCompany()
        {
            List<CompanyViewModal> companyList = new List<CompanyViewModal>();
            HttpResponseMessage response = client.GetAsync(client.BaseAddress + "/CompanyAPI/GetAllCompany").Result;
            if (response.IsSuccessStatusCode) 
            { 
                string data = response.Content.ReadAsStringAsync().Result;
                JsonConvert.DeserializeObject<CompanyViewModal>(data);
            }
            return View(companyList);
        }
    }
}