using eMedicineWeb.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace eMedicineWeb.Controllers
{
    public class CompanyController : Controller
    {
        // GET: Company
        Uri baseAddress = new Uri(ConfigurationManager.AppSettings["ServerURL"]+ "CompanyAPI");        
        HttpClient client;        
        public CompanyController()
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

        public ActionResult UIEntryCompany()
        {
            return View();
        }

        public async Task<JsonResult> GetAllCompany()
        {
            List<CompanyViewModel> companyList = new List<CompanyViewModel>();
            try
            {
                HttpResponseMessage response = await client.GetAsync(client.BaseAddress + "/GetAllCompany");
                if (response.IsSuccessStatusCode)
                {
                    string data = await response.Content.ReadAsStringAsync();
                    var Response = JsonConvert.DeserializeObject<CompanyResponse>(data);
                    if (Response.Success)
                    {
                        if (!string.IsNullOrEmpty(data))
                        {
                            companyList = Response?.Data ?? new List<CompanyViewModel>();
                        }
                    }
                }
                else
                {
                    return Json(new { Success = false, message = "Failed to retrieve Company. Please try again later." }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { Success = false, message = $"An error occurred: {ex.Message}" }, JsonRequestBehavior.AllowGet);
            }

            return Json(new { Success = true, data = companyList }, JsonRequestBehavior.AllowGet);
        }

        //[HttpPost] // old company save without image
        //public async Task<ActionResult> CreateCompany(CompanyViewModel company)
        //{
        //    bool Satus = false;
        //    if (!ModelState.IsValid)
        //    {
        //        return View(company);
        //    }
        //    string data = JsonConvert.SerializeObject(company);
        //    StringContent content = new StringContent(data, Encoding.UTF8, "application/json");

        //    HttpResponseMessage response = await client.PostAsync(client.BaseAddress + "/CreateCompany", content);
        //    if (response.IsSuccessStatusCode)
        //    {
        //        return Json(new { success = true, message = "Company create Successfully" });
        //    }
        //    ModelState.AddModelError("", "Unable to create Company. Please try again.");
        //    return Json(new { success = false, message = "Failed to retrieve Company details." });
        //}

        [HttpPost]
        public async Task<ActionResult> CreateCompany(CompanyViewModel company, HttpPostedFileBase imageFile)
        {

            if (!ModelState.IsValid)
            {
                return Json(new { success = false, message = "Failed Insert company details." });
            }
            if (imageFile == null || imageFile.ContentLength == 0)
            {
                return Json(new { success = false, message = "Image file is required." });
            }
            try
            {
                string uploadsFolder = Server.MapPath("~/Uploads");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                string uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(imageFile.FileName);
                string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                imageFile.SaveAs(filePath);
                company.ImagePath = $"/Uploads/{uniqueFileName}";

                string data = JsonConvert.SerializeObject(company);
                StringContent content = new StringContent(data, Encoding.UTF8, "application/json");

                HttpResponseMessage response = await client.PostAsync(client.BaseAddress + "/CreateCompany", content);

                if (response.IsSuccessStatusCode)
                {
                    return Json(new { success = true, message = "Company create Successfully" });
                }
                ModelState.AddModelError("", "Unable to create Company. Please try again.");
                return Json(new { success = false, message = "Failed to retrieve Company details." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "An error occurred.", error = ex.Message });
            }
        }

        [HttpPost] 
        public async Task<JsonResult> GetCompanyById(string companyId)
        {
            CompanyViewModel company = null;
            try
            {
                HttpResponseMessage response = await client.GetAsync(client.BaseAddress + "/GetCompanyById/" + companyId);

                if (response.IsSuccessStatusCode)
                {
                    string data = await response.Content.ReadAsStringAsync();
                    var Response = JsonConvert.DeserializeObject<CompanyResponse>(data);
                    if (Response.Success)
                    {
                        try
                        {

                            var Comapnys = Response?.Data ?? new List<CompanyViewModel>();
                            company = Comapnys.FirstOrDefault();
                        }
                        catch (JsonSerializationException)
                        {
                            var Comapnys = JsonConvert.DeserializeObject<List<CompanyViewModel>>(data);
                            company = Comapnys.FirstOrDefault();
                        }
                    }
                    else
                    {
                        return Json(new { success = false, message = "Failed to retrieve Comapny details." }, JsonRequestBehavior.AllowGet);
                    }

                    if (company != null)
                    {
                        return Json(new { Success = true, data = company }, JsonRequestBehavior.AllowGet);
                    }
                }

                return Json(new { Success = false, message = "Failed to retrieve Comapny details." }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Success = false, message = $"An error occurred: {ex.Message}" });
            }
        }

        //[HttpPost] // Old update without image
        //public async Task<ActionResult> UpdateCompanyById(CompanyViewModel company)
        //{
        //    bool Satus = false;
        //    if (!ModelState.IsValid)
        //    {
        //        return View(company);
        //    }
        //    string data = JsonConvert.SerializeObject(company);
        //    StringContent content = new StringContent(data, Encoding.UTF8, "application/json");

        //    HttpResponseMessage response = await client.PostAsync(client.BaseAddress + "/UpdateCompanyById", content);
        //    if (response.IsSuccessStatusCode)
        //    {
        //        return Json(new { success = true, message = "Update Successfully" });
        //    }
        //    ModelState.AddModelError("", "Unable to Update Company. Please try again.");
        //    return Json(new { success = false, message = "Failed to retrieve Update details." });
        //}
        [HttpPost]
        public async Task<ActionResult> UpdateCompanyById(CompanyViewModel Item, HttpPostedFileBase imageFile)
        {
            if (!ModelState.IsValid)
            {
                return Json(new { success = false, message = "Failed Insert Company details." });
            }

            if (imageFile == null || imageFile.ContentLength == 0)
            {
                return Json(new { success = false, message = "Image file is required." });
            }
            try
            {
                string uploadsFolder = Server.MapPath("~/Uploads");

                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }
                string fileExtension = Path.GetExtension(imageFile.FileName);
                string baseFileName = Guid.NewGuid().ToString();

                string uniqueFileName = baseFileName + fileExtension;
                string filePath = Path.Combine(uploadsFolder, uniqueFileName);
                string preImagePath = Server.MapPath(Item.PreImagePath);
                if (System.IO.File.Exists(preImagePath))
                {
                    System.IO.File.Delete(preImagePath);
                }
                imageFile.SaveAs(filePath);
                Item.ImagePath = $"/Uploads/{uniqueFileName}";
                string data = JsonConvert.SerializeObject(Item);
                StringContent content = new StringContent(data, Encoding.UTF8, "application/json");
                HttpResponseMessage response = await client.PostAsync(client.BaseAddress + "/UpdateCompanyById", content);
                if (response.IsSuccessStatusCode)
                {
                    return Json(new { success = true, message = "Company updated successfully" });
                }
                else
                {
                    ModelState.AddModelError("", "Unable to update Company. Please try again.");
                    return Json(new { success = false, message = "Failed to retrieve Company details." });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "An error occurred.", error = ex.Message });
            }
        }
    }
}