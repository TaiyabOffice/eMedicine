﻿using eMedicineWeb.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace eMedicineWeb.Controllers
{
    public class SalesPersonController : Controller
    {
        // GET: SalesPerson  
        Uri baseAddress = new Uri(ConfigurationManager.AppSettings["ServerURL"] + "SalesPersonAPI");
        HttpClient client;        
        public SalesPersonController()
        {
            client = new HttpClient();
            client.BaseAddress = baseAddress;

        }
        public ActionResult UIEntrySalesPerson()
        {
            return View();
        }
        public async Task<ActionResult> GetAllSalesPerson()
        {
            List<SalesPersonViewModel> salesPersonList = new List<SalesPersonViewModel>();

            try
            {               
                HttpResponseMessage response = await client.GetAsync(client.BaseAddress + "/GetAllSalesPerson");
                
                if (response.IsSuccessStatusCode)
                {
                    string data = await response.Content.ReadAsStringAsync();
                    
                    if (!string.IsNullOrEmpty(data))
                    {
                        salesPersonList = JsonConvert.DeserializeObject<List<SalesPersonViewModel>>(data);
                    }
                }
                else
                {
                    ModelState.AddModelError(string.Empty, "Failed to retrieve sales Person. Please try again later.");
                }
            }
            catch (Exception ex)
            {                
                ModelState.AddModelError(string.Empty, $"An error occurred: {ex.Message}");
            }            
            return View(salesPersonList);
        }
        [HttpPost]
        public async Task<ActionResult> CreateSalesPerson(SalesPersonViewModel salesPerson)
        {
            if (!ModelState.IsValid)
            {
                return View(salesPerson);
            }
            string data = JsonConvert.SerializeObject(salesPerson);
            StringContent content = new StringContent(data, Encoding.UTF8, "application/json");

            HttpResponseMessage response = await client.PostAsync(client.BaseAddress + "/CreateSalesPerson", content);
            if (response.IsSuccessStatusCode)
            {
                return RedirectToAction("GetAllSalesPerson");
            }            
            ModelState.AddModelError("", "Unable to create sales Person. Please try again.");
            return View(salesPerson); 
        }
        public ActionResult GetSalesPersonById(string salesPersonId)
        {
            SalesPersonViewModel salesPerson = null;
            HttpResponseMessage response = client.GetAsync(client.BaseAddress + "/GetSalesPersonById/" + salesPersonId).Result;

            if (response.IsSuccessStatusCode)
            {
                string data = response.Content.ReadAsStringAsync().Result;                
                try
                {
                    salesPerson = JsonConvert.DeserializeObject<SalesPersonViewModel>(data);
                }
                catch (JsonSerializationException)
                {                    
                    var salesPersons = JsonConvert.DeserializeObject<List<SalesPersonViewModel>>(data);
                    salesPerson = salesPersons.FirstOrDefault();
                }
            }
            return View(salesPerson);
        }        
        [HttpPost]
        public async Task<ActionResult> UpdateSalesPersonById(SalesPersonViewModel salesPerson)
        {
            if (!ModelState.IsValid)
            {
                return View(salesPerson);
            }
            string data = JsonConvert.SerializeObject(salesPerson);
            StringContent content = new StringContent(data, Encoding.UTF8, "application/json");

            HttpResponseMessage response = await client.PostAsync(client.BaseAddress + "/UpdateSalesPersonById", content);
            if (response.IsSuccessStatusCode)
            {
                return RedirectToAction("GetAllSalesPerson");
            }
            ModelState.AddModelError("", "Unable to create sales Person. Please try again.");
            return View(salesPerson);
        }
    }
}