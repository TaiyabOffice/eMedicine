﻿using eMedicineWeb.Models;
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
    public class ItemController : Controller
    {
        // GET: Item
        Uri baseAddress = new Uri(ConfigurationManager.AppSettings["ServerURL"] + "ItemAPI");
        HttpClient client;
        public ItemController()
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

        public ActionResult UIEntryItem()
        {
            return View();
        }

        public ActionResult ItemDemo()
        {
            return View();
        }

        public ActionResult UIItemList()
        {
            return View();
        }

        public ActionResult UIEntryOffer()
        {
            return View();
        }

        public ActionResult UIOfferDetails()
        {
            return View();
        }

        #region Items
        public async Task<ActionResult> GetAllItem()
        {
            List<ItemViewModel> ItemList = new List<ItemViewModel>();

            try
            {
                HttpResponseMessage response = await client.GetAsync(client.BaseAddress + "/GetAllItem");

                if (response.IsSuccessStatusCode)
                {
                    string data = await response.Content.ReadAsStringAsync();
                    var Response = JsonConvert.DeserializeObject<ItemResponse>(data);
                    if (Response.Success)
                    {
                        if (!string.IsNullOrEmpty(data))
                        {
                            ItemList = Response?.Data ?? new List<ItemViewModel>();
                        }
                    }
                }
                else
                {
                    return Json(new { success = false, message = "Failed to retrieve Item. Please try again later." }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"An error occurred: {ex.Message}" }, JsonRequestBehavior.AllowGet);
            }
            return Json(new { success = true, data = ItemList }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public async Task<ActionResult> CreateItem(ItemViewModel Item, HttpPostedFileBase imageFile)
        {

            if (!ModelState.IsValid)
            {
                return Json(new { success = false, message = "Failed Insert Item details." });
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
                Item.ImagePath = $"/Uploads/{uniqueFileName}";

                string data = JsonConvert.SerializeObject(Item);
                StringContent content = new StringContent(data, Encoding.UTF8, "application/json");

                HttpResponseMessage response = await client.PostAsync(client.BaseAddress + "/CreateItem", content);

                if (response.IsSuccessStatusCode)
                {
                    return Json(new { success = true, message = "Item create Successfully" });
                }
                ModelState.AddModelError("", "Unable to create Item. Please try again.");
                return Json(new { success = false, message = "Failed to retrieve Item details." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "An error occurred.", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetItemById(string ItemId)
        {
            ItemViewModel Item = null;
            try
            {
                HttpResponseMessage response = client.GetAsync(client.BaseAddress + "/GetItemById/" + ItemId).Result;
                if (response.IsSuccessStatusCode)
                {
                    string data = await response.Content.ReadAsStringAsync();
                    var Response = JsonConvert.DeserializeObject<ItemResponse>(data);
                    if (Response.Success)
                    {
                        try
                        {
                            var Items = Response?.Data ?? new List<ItemViewModel>();
                            Item = Items.FirstOrDefault();
                        }
                        catch (JsonSerializationException)
                        {
                            var Items = JsonConvert.DeserializeObject<List<ItemViewModel>>(data);
                            Item = Items.FirstOrDefault();
                        }
                    }
                    else
                    {
                        return Json(new { success = false, message = "Failed to retrieve Item details." }, JsonRequestBehavior.AllowGet);
                    }

                    if (Item != null)
                    {
                        return Json(new { Success = true, data = Item }, JsonRequestBehavior.AllowGet);
                    }
                }
                return Json(new { Success = false, message = "Failed to retrieve Item details." }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Success = false, message = $"An error occurred: {ex.Message}" });
            }
        }

        [HttpPost]
        public async Task<ActionResult> UpdateItemById(ItemViewModel Item, HttpPostedFileBase imageFile)
        {
            if (!ModelState.IsValid)
            {
                return Json(new { success = false, message = "Failed Insert Item details." });
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
                HttpResponseMessage response = await client.PostAsync(client.BaseAddress + "/UpdateItemById", content);
                if (response.IsSuccessStatusCode)
                {
                    return Json(new { success = true, message = "Item updated successfully" });
                }
                else
                {
                    ModelState.AddModelError("", "Unable to update Item. Please try again.");
                    return Json(new { success = false, message = "Failed to retrieve Item details." });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "An error occurred.", error = ex.Message });
            }
        }

        #endregion

        #region Offers
        [HttpPost]
        public async Task<ActionResult> CreateOffer(OffersViewModel Offer, HttpPostedFileBase imageFile)
        {

            if (!ModelState.IsValid)
            {
                return Json(new { success = false, message = "Failed Insert Offer." });
            }
            if (imageFile == null || imageFile.ContentLength == 0)
            {
                return Json(new { success = false, message = "Image file is required." });
            }
            try
            {
                string uploadsFolder = Server.MapPath("~/OffersImg");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                string uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(imageFile.FileName);
                string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                imageFile.SaveAs(filePath);
                Offer.OfferImagePath =  $"/OffersImg/{uniqueFileName}";

                string data = JsonConvert.SerializeObject(Offer);
                StringContent content = new StringContent(data, Encoding.UTF8, "application/json");

                HttpResponseMessage response = await client.PostAsync(client.BaseAddress + "/CreateOffer", content);

                if (response.IsSuccessStatusCode)
                {
                    return Json(new { success = true, message = "Offer create Successfully" });
                }
                ModelState.AddModelError("", "Unable to create Offer. Please try again.");
                return Json(new { success = false, message = "Failed to retrieve Offer." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "An error occurred.", error = ex.Message });
            }
        }

        public async Task<ActionResult> GetAllIOffers()
        {
            List<OffersViewModel> OfferList = new List<OffersViewModel>();

            try
            {
                HttpResponseMessage response = await client.GetAsync(client.BaseAddress + "/GetAllIOffers");

                if (response.IsSuccessStatusCode)
                {
                    string data = await response.Content.ReadAsStringAsync();
                    var Response = JsonConvert.DeserializeObject<OffersResponse>(data);
                    if (Response.Success)
                    {
                        if (!string.IsNullOrEmpty(data))
                        {
                            OfferList = Response?.Data ?? new List<OffersViewModel>();
                        }
                    }
                }
                else
                {
                    return Json(new { success = false, message = "Failed to retrieve Offer. Please try again later." }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"An error occurred: {ex.Message}" }, JsonRequestBehavior.AllowGet);
            }
            return Json(new { success = true, data = OfferList }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public async Task<JsonResult> GetOfferById(string OfferId)
        {
            OffersViewModel Offer = null;
            try
            {
                HttpResponseMessage response = client.GetAsync(client.BaseAddress + "/GetOfferById/" + OfferId).Result;
                if (response.IsSuccessStatusCode)
                {
                    string data = await response.Content.ReadAsStringAsync();
                    var Response = JsonConvert.DeserializeObject<OffersResponse>(data);
                    if (Response.Success)
                    {
                        try
                        {
                            var Items = Response?.Data ?? new List<OffersViewModel>();
                            Offer = Items.FirstOrDefault();
                        }
                        catch (JsonSerializationException)
                        {
                            var Items = JsonConvert.DeserializeObject<List<OffersViewModel>>(data);
                            Offer = Items.FirstOrDefault();
                        }
                    }
                    else
                    {
                        return Json(new { success = false, message = "Failed to retrieve Offer details." }, JsonRequestBehavior.AllowGet);
                    }

                    if (Offer != null)
                    {
                        return Json(new { Success = true, data = Offer }, JsonRequestBehavior.AllowGet);
                    }
                }
                return Json(new { Success = false, message = "Failed to retrieve Offer details." }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Success = false, message = $"An error occurred: {ex.Message}" });
            }
        }

        [HttpPost]
        public async Task<ActionResult> UpdateOfferById(OffersViewModel offer, HttpPostedFileBase imageFile)
        {
            if (!ModelState.IsValid)
            {
                return Json(new { success = false, message = "Failed Insert Offer details." });
            }

            if (imageFile == null || imageFile.ContentLength == 0)
            {
                return Json(new { success = false, message = "Image file is required." });
            }
            try
            {
                string uploadsFolder = Server.MapPath("~/OffersImg");

                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }
                string fileExtension = Path.GetExtension(imageFile.FileName);
                string baseFileName = Guid.NewGuid().ToString();

                string uniqueFileName = baseFileName + fileExtension;
                string filePath = Path.Combine(uploadsFolder, uniqueFileName);
                string preImagePath = Server.MapPath(offer.PreImagePath);
                if (System.IO.File.Exists(preImagePath))
                {
                    System.IO.File.Delete(preImagePath);
                }
                imageFile.SaveAs(filePath);
                offer.OfferImagePath =  $"/OffersImg/{uniqueFileName}";
                string data = JsonConvert.SerializeObject(offer);
                StringContent content = new StringContent(data, Encoding.UTF8, "application/json");
                HttpResponseMessage response = await client.PostAsync(client.BaseAddress + "/UpdateOfferById", content);
                if (response.IsSuccessStatusCode)
                {
                    return Json(new { success = true, message = "Offer updated successfully" });
                }
                else
                {
                    ModelState.AddModelError("", "Unable to update Offer. Please try again.");
                    return Json(new { success = false, message = "Failed to retrieve Offer details." });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "An error occurred.", error = ex.Message });
            }
        }

        public async Task<ActionResult> AddOfferItems(string OfferId)
        {
            List<ItemViewModel> ItemList = new List<ItemViewModel>();

            try
            {               
                HttpResponseMessage response = client.GetAsync(client.BaseAddress + "/AddOfferItems/" + OfferId).Result;

                if (response.IsSuccessStatusCode)
                {
                    string data = await response.Content.ReadAsStringAsync();
                    var Response = JsonConvert.DeserializeObject<ItemResponse>(data);
                    if (Response.Success)
                    {
                        if (!string.IsNullOrEmpty(data))
                        {
                            ItemList = Response?.Data ?? new List<ItemViewModel>();
                        }
                    }
                }
                else
                {
                    return Json(new { success = false, message = "Failed to retrieve Item. Please try again later." }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"An error occurred: {ex.Message}" }, JsonRequestBehavior.AllowGet);
            }
            return Json(new { success = true, data = ItemList }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public async Task<ActionResult> SaveOfferItems(List<OfferItemsViewModel> OfferItems)
        {
            if (!ModelState.IsValid)
            {
                return Json(new { success = false, message = "Failed to validate input." });
            }
            string data = JsonConvert.SerializeObject(OfferItems);
            StringContent content = new StringContent(data, Encoding.UTF8, "application/json");
            HttpResponseMessage response = await client.PostAsync(client.BaseAddress + "/SaveOfferItems", content);

            if (response.IsSuccessStatusCode)
            {
                return Json(new { success = true, message = "Order create Successfully" });
            }

            ModelState.AddModelError("", "Unable to create one or more orders. Please try again.");
            return Json(new { success = false, message = "Failed to save orders." });
        }

        public async Task<ActionResult> GetItemsByOfferId(string OfferId)
        {
            List<ItemViewModel> ItemList = new List<ItemViewModel>();
            OffersViewModel Offer = null;                    
            try
            {
                HttpResponseMessage OfferResponse = client.GetAsync(client.BaseAddress + "/GetOfferById/" + OfferId).Result;
                HttpResponseMessage response = client.GetAsync(client.BaseAddress + "/GetItemsByOfferId/" + OfferId).Result;
                if (OfferResponse.IsSuccessStatusCode)
                {
                    string data = await OfferResponse.Content.ReadAsStringAsync();
                    var Response = JsonConvert.DeserializeObject<OffersResponse>(data);
                    if (Response.Success)
                    {

                        var Items = Response?.Data ?? new List<OffersViewModel>();
                        Offer = Items.FirstOrDefault();
                    }
                }
                else
                {
                    return Json(new { success = false, message = "Failed to retrieve Item. Please try again later." }, JsonRequestBehavior.AllowGet);
                }

                if (response.IsSuccessStatusCode)
                {
                    string data = await response.Content.ReadAsStringAsync();
                    var Response = JsonConvert.DeserializeObject<ItemResponse>(data);
                    if (Response.Success)
                    {
                        if (!string.IsNullOrEmpty(data))
                        {
                            ItemList = Response?.Data ?? new List<ItemViewModel>();
                        }
                    }
                }
                else
                {
                    return Json(new { success = false, message = "Failed to retrieve Item. Please try again later." }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"An error occurred: {ex.Message}" }, JsonRequestBehavior.AllowGet);
            }
            return Json(new { success = true, data = Offer, data1 = ItemList }, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region Disease Wise Medicine
        public ActionResult UIEntryDiseaseWiseMedicine()
        {
            return View();
        }

        public async Task<ActionResult> GetAllDisease()
        {
            List<DiseaseViewModel> DiseaseList = new List<DiseaseViewModel>();

            try
            {
                HttpResponseMessage response = await client.GetAsync(client.BaseAddress + "/GetAllDisease");

                if (response.IsSuccessStatusCode)
                {
                    string data = await response.Content.ReadAsStringAsync();
                    var Response = JsonConvert.DeserializeObject<DiseaseResponse>(data);
                    if (Response.Success)
                    {
                        if (!string.IsNullOrEmpty(data))
                        {
                            DiseaseList = Response?.Data ?? new List<DiseaseViewModel>();
                        }
                    }
                }
                else
                {
                    return Json(new { success = false, message = "Failed to retrieve Disease. Please try again later." }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"An error occurred: {ex.Message}" }, JsonRequestBehavior.AllowGet);
            }
            return Json(new { success = true, data = DiseaseList }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public async Task<ActionResult> CreateDiseaseData(DiseaseViewModel Disease)
        {

            if (!ModelState.IsValid)
            {
                return Json(new { success = false, message = "Failed Insert Disease details." });
            }
            string data = JsonConvert.SerializeObject(Disease);
            StringContent content = new StringContent(data, Encoding.UTF8, "application/json");

            HttpResponseMessage response = await client.PostAsync(client.BaseAddress + "/CreateDiseaseData", content);

            if (response.IsSuccessStatusCode)
            {
                return Json(new { success = true, message = "Disease create Successfully" });
            }
            ModelState.AddModelError("", "Unable to create Disease. Please try again.");
            return Json(new { success = false, message = "Failed to retrieve Disease details." });
        }
        [HttpPost]
        public async Task<JsonResult> GetDiseaseById(string DiseaseId)
        {
            DiseaseViewModel Disease = null;
            try
            {
                HttpResponseMessage response = client.GetAsync(client.BaseAddress + "/GetDiseaseById/" + DiseaseId).Result;
                if (response.IsSuccessStatusCode)
                {
                    string data = await response.Content.ReadAsStringAsync();
                    var Response = JsonConvert.DeserializeObject<DiseaseResponse>(data);
                    if (Response.Success)
                    {
                        try
                        {
                            //Disease = JsonConvert.DeserializeObject<DiseaseViewModel>(data);
                            //Disease = Response?.Data ?? new DiseaseViewModel();

                            var Diseases = Response?.Data ?? new List<DiseaseViewModel>();
                            Disease = Diseases.FirstOrDefault();
                        }
                        catch (JsonSerializationException)
                        {
                            var Diseases = JsonConvert.DeserializeObject<List<DiseaseViewModel>>(data);
                            Disease = Diseases.FirstOrDefault();
                        }
                    }
                    else
                    {
                        return Json(new { success = false, message = "Failed to retrieve Disease details." }, JsonRequestBehavior.AllowGet);
                    }

                    if (Disease != null)
                    {
                        return Json(new { Success = true, data = Disease }, JsonRequestBehavior.AllowGet);
                    }
                }
                return Json(new { Success = false, message = "Failed to retrieve Disease details." }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Success = false, message = $"An error occurred: {ex.Message}" });
            }
        }
        [HttpPost]
        public async Task<ActionResult> UpdateDiseaseById(DiseaseViewModel Disease)
        {
            bool Satus = false;
            if (!ModelState.IsValid)
            {
                return Json(new { success = false, message = "Failed Insert Disease details." });
            }
            string data = JsonConvert.SerializeObject(Disease);
            StringContent content = new StringContent(data, Encoding.UTF8, "application/json");

            HttpResponseMessage response = await client.PostAsync(client.BaseAddress + "/UpdateDiseaseById", content);

            if (response.IsSuccessStatusCode)
            {
                return Json(new { success = true, message = "Disease update Successfully" });
            }
            ModelState.AddModelError("", "Unable to update Disease. Please try again.");
            return Json(new { success = false, message = "Failed to retrieve Disease details." });
        }
        #endregion
    }

}