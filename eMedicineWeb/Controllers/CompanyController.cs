using eMedicineWeb.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace eMedicineWeb.Controllers
{
    public class CompanyController : Controller
    {
        // GET: Company
        Uri baseAddress = new Uri("http://localhost:5041/api/CompanyAPI");
        HttpClient client;
        public CompanyController() 
        { 
            client = new HttpClient();
            client.BaseAddress = baseAddress;

        }

        public ActionResult GetAllCompany()
        {
            List<CompanyViewModal> companyList = new List<CompanyViewModal>();
            HttpResponseMessage response = client.GetAsync(client.BaseAddress + "/GetAllCompany").Result;
            if (response.IsSuccessStatusCode) 
            { 
                string data = response.Content.ReadAsStringAsync().Result;
                companyList = JsonConvert.DeserializeObject<List<CompanyViewModal>>(data);
            }
            return View(companyList);
        }

        public ActionResult CreateCompany()
        {
            return View();
        }
        [HttpPost]
        public ActionResult CreateCompany(CompanyViewModal company)
        {
            string data = JsonConvert.SerializeObject(company);
            StringContent content = new StringContent(data, Encoding.UTF8, "application/json");
            HttpResponseMessage response = client.PostAsync(client.BaseAddress + "/CreateCompany", content).Result;
            if (response.IsSuccessStatusCode) 
            {
                return RedirectToAction("GetAllCompany");
            }

            return View();
        }


        public ActionResult DeleteCompany()
        {
            return View();
        }
        public ActionResult EditCompany() 
        {
            return View();

        }
    }
}