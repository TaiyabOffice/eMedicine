using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Text;
using eMedicineAdmin.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.IO;
using static System.Runtime.InteropServices.JavaScript.JSType;
using Microsoft.AspNetCore.Hosting.Server;

namespace eMedicineAdmin.Controllers
{
    public class ItemController : Controller
    {
        private readonly HttpClient _httpClient;

        public ItemController(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient("eMedicineClient");
        }
        public IActionResult UIEntryItem()
        {
            string menuDataJson = HttpContext.Session.GetString("MenuData");
            var menuLists = string.IsNullOrEmpty(menuDataJson)
                ? new List<MenuViewModel>()
                : JsonConvert.DeserializeObject<List<MenuViewModel>>(menuDataJson);

            ViewBag.MenuData = menuLists;
            return View();
        }

        public IActionResult UIItemList()
        {
            string menuDataJson = HttpContext.Session.GetString("MenuData");
            var menuLists = string.IsNullOrEmpty(menuDataJson)
                ? new List<MenuViewModel>()
                : JsonConvert.DeserializeObject<List<MenuViewModel>>(menuDataJson);

            ViewBag.MenuData = menuLists;
            return View();
        }

        public IActionResult UIEntryOffer()
        {
            string menuDataJson = HttpContext.Session.GetString("MenuData");
            var menuLists = string.IsNullOrEmpty(menuDataJson)
                ? new List<MenuViewModel>()
                : JsonConvert.DeserializeObject<List<MenuViewModel>>(menuDataJson);

            ViewBag.MenuData = menuLists;
            return View();
        }
        public IActionResult UIOfferDetails()
        {
            string menuDataJson = HttpContext.Session.GetString("MenuData");
            var menuLists = string.IsNullOrEmpty(menuDataJson)
                ? new List<MenuViewModel>()
                : JsonConvert.DeserializeObject<List<MenuViewModel>>(menuDataJson);

            ViewBag.MenuData = menuLists;
            return View();
        }

        public async Task<JsonResult> GetAllItem()
        {
            try
            {
                var response = await _httpClient.GetAsync($"{_httpClient.BaseAddress}ItemAPI/GetAllItem");

                if (!response.IsSuccessStatusCode)
                {
                    return Json(new { success = false, message = "Failed to retrieve Item List. Please try again later." });
                }

                var responseData = JsonConvert.DeserializeObject<ItemViewModel>(await response.Content.ReadAsStringAsync());

                if (responseData?.Success == true && responseData.Data != null)
                {
                    return Json(new { success = true, data = responseData.Data });
                }

                return Json(new { success = false, message = "Item List is empty or could not be loaded." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }
        [HttpPost]
        public async Task<IActionResult> CreateItem(ItemViewModel item, IFormFile imageFile)
        {
            if (!ModelState.IsValid)
            {
                return Json(new { success = false, message = "Invalid item details." });
            }

            if (imageFile == null || imageFile.Length == 0)
            {
                return Json(new { success = false, message = "Image file is required." });
            }

            try
            {
                
                string uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Uploads");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }
                
                string uniqueFileName = $"{Guid.NewGuid()}{Path.GetExtension(imageFile.FileName)}";
                string filePath = Path.Combine(uploadsFolder, uniqueFileName);
               
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await imageFile.CopyToAsync(stream);
                }

                item.ImagePath = $"/Uploads/{uniqueFileName}";
                
                var content = new StringContent(JsonConvert.SerializeObject(item), Encoding.UTF8, "application/json");
                
                var response = await _httpClient.PostAsync($"{_httpClient.BaseAddress}ItemAPI/CreateItem", content);

                return Json(new
                {
                    success = response.IsSuccessStatusCode,
                    message = response.IsSuccessStatusCode ? "Item created successfully." : "Failed to create item. Please try again."
                });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "An error occurred.", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetItemById(string ItemId)
        {
            try
            {
                var response = await _httpClient.GetAsync($"{_httpClient.BaseAddress}ItemAPI/GetItemById/{ItemId}");

                if (!response.IsSuccessStatusCode)
                {
                    return Json(new { success = false, message = "Failed to retrieve Item. Please try again later." });
                }

                var responseData = await response.Content.ReadAsStringAsync();

                if (JsonConvert.DeserializeObject<ItemViewModel>(responseData) is { } Item && Item.Data != null)
                {
                    return Json(new { success = true, data = Item.Data.FirstOrDefault() });
                }

                if (JsonConvert.DeserializeObject<List<ItemViewModel>>(responseData) is { } Items)
                {
                    return Json(new { success = true, data = Items.FirstOrDefault() });
                }

                return Json(new { success = false, message = "Item data is not in the expected format." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }
        [HttpPost]
        public async Task<IActionResult> UpdateItemById(ItemViewModel item, IFormFile imageFile)
        {
            if (!ModelState.IsValid)
            {
                return Json(new { success = false, message = "Invalid item details." });
            }

            if (imageFile != null && imageFile.Length > 0)
            {
                try
                {                    
                    string uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Uploads");
                    
                    if (!Directory.Exists(uploadsFolder))
                    {
                        Directory.CreateDirectory(uploadsFolder);
                    }
                    
                    string fileExtension = Path.GetExtension(imageFile.FileName);
                    string uniqueFileName = $"{Guid.NewGuid()}{fileExtension}";
                    string filePath = Path.Combine(uploadsFolder, uniqueFileName);
                   
                    if (!string.IsNullOrEmpty(item.PreImagePath))
                    {
                        string preImagePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", item.PreImagePath.TrimStart('/'));
                        if (System.IO.File.Exists(preImagePath))
                        {
                            System.IO.File.Delete(preImagePath);
                        }
                    }
                    
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await imageFile.CopyToAsync(stream);
                    }

                    item.ImagePath = $"/Uploads/{uniqueFileName}";
                }
                catch (Exception ex)
                {
                    return Json(new { success = false, message = "An error occurred while uploading the image.", error = ex.Message });
                }
            }

            try
            {               
                var content = new StringContent(JsonConvert.SerializeObject(item), Encoding.UTF8, "application/json");

               
                var response = await _httpClient.PostAsync($"{_httpClient.BaseAddress}/UpdateItemById", content);

                if (response.IsSuccessStatusCode)
                {
                    return Json(new { success = true, message = "Item updated successfully." });
                }
                else
                {
                    return Json(new { success = false, message = "Failed to update item. Please try again." });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "An error occurred.", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateOffer(OffersViewModel item, IFormFile imageFile)
        {
            if (!ModelState.IsValid)
            {
                return Json(new { success = false, message = "Invalid item details." });
            }

            if (imageFile == null || imageFile.Length == 0)
            {
                return Json(new { success = false, message = "Image file is required." });
            }

            try
            {

                string uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "OffersImg");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                string uniqueFileName = $"{Guid.NewGuid()}{Path.GetExtension(imageFile.FileName)}";
                string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await imageFile.CopyToAsync(stream);
                }

                item.OfferImagePath = $"/OffersImg/{uniqueFileName}";

                var content = new StringContent(JsonConvert.SerializeObject(item), Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync($"{_httpClient.BaseAddress}ItemAPI/CreateOffer", content);

                return Json(new
                {
                    success = response.IsSuccessStatusCode,
                    message = response.IsSuccessStatusCode ? "Item created successfully." : "Failed to create item. Please try again."
                });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "An error occurred.", error = ex.Message });
            }
        }

        public async Task<JsonResult> GetAllIOffers()
        {
            try
            {
                var response = await _httpClient.GetAsync($"{_httpClient.BaseAddress}ItemAPI/GetAllIOffers");

                if (!response.IsSuccessStatusCode)
                {
                    return Json(new { success = false, message = "Failed to retrieve Item List. Please try again later." });
                }

                var responseData = JsonConvert.DeserializeObject<OffersViewModel>(await response.Content.ReadAsStringAsync());

                if (responseData?.Success == true && responseData.Data != null)
                {
                    return Json(new { success = true, data = responseData.Data });
                }

                return Json(new { success = false, message = "Item List is empty or could not be loaded." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }
        [HttpPost]
        public async Task<JsonResult> GetOfferById(string OfferId)
        {
            try
            {
                var response = await _httpClient.GetAsync($"{_httpClient.BaseAddress}ItemAPI/GetOfferById/{OfferId}");

                if (!response.IsSuccessStatusCode)
                {
                    return Json(new { success = false, message = "Failed to retrieve Item. Please try again later." });
                }

                var responseData = await response.Content.ReadAsStringAsync();

                if (JsonConvert.DeserializeObject<OffersViewModel>(responseData) is { } Item && Item.Data != null)
                {
                    return Json(new { success = true, data = Item.Data.FirstOrDefault() });
                }

                if (JsonConvert.DeserializeObject<List<OffersViewModel>>(responseData) is { } Items)
                {
                    return Json(new { success = true, data = Items.FirstOrDefault() });
                }

                return Json(new { success = false, message = "Item data is not in the expected format." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"An error occurred: {ex.Message}" });
            }
        }
        [HttpPost]
        public async Task<IActionResult> UpdateOfferById(OffersViewModel item, IFormFile imageFile)
        {
            if (!ModelState.IsValid)
            {
                return Json(new { success = false, message = "Invalid item details." });
            }

            if (imageFile != null && imageFile.Length > 0)
            {
                try
                {
                    string uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "OffersImg");

                    if (!Directory.Exists(uploadsFolder))
                    {
                        Directory.CreateDirectory(uploadsFolder);
                    }

                    string fileExtension = Path.GetExtension(imageFile.FileName);
                    string uniqueFileName = $"{Guid.NewGuid()}{fileExtension}";
                    string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                    if (!string.IsNullOrEmpty(item.PreImagePath))
                    {
                        string preImagePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", item.PreImagePath.TrimStart('/'));
                        if (System.IO.File.Exists(preImagePath))
                        {
                            System.IO.File.Delete(preImagePath);
                        }
                    }

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await imageFile.CopyToAsync(stream);
                    }

                    item.OfferImagePath = $"/OffersImg/{uniqueFileName}";
                }
                catch (Exception ex)
                {
                    return Json(new { success = false, message = "An error occurred while uploading the image.", error = ex.Message });
                }
            }

            try
            {
                var content = new StringContent(JsonConvert.SerializeObject(item), Encoding.UTF8, "application/json");


                var response = await _httpClient.PostAsync($"{_httpClient.BaseAddress}/UpdateItemById", content);

                if (response.IsSuccessStatusCode)
                {
                    return Json(new { success = true, message = "Item updated successfully." });
                }
                else
                {
                    return Json(new { success = false, message = "Failed to update item. Please try again." });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "An error occurred.", error = ex.Message });
            }
        }
        public async Task<IActionResult> AddOfferItems(string offerId)
        {
            if (string.IsNullOrWhiteSpace(offerId))
            {
                return Json(new { success = false, message = "Offer ID cannot be empty." });
            }

            try
            {
                var response = await _httpClient.GetAsync($"ItemAPI/AddOfferItems/{offerId}");

                if (!response.IsSuccessStatusCode)
                {
                    return Json(new { success = false, message = "Failed to retrieve items. Please try again later." });
                }

                var data = await response.Content.ReadAsStringAsync();
                var responseData = JsonConvert.DeserializeObject<ItemViewModel>(data);

                var itemList = responseData?.Success == true ? responseData.Data ?? new List<ItemViewModel>() : new List<ItemViewModel>();

                return Json(new { success = true, data = itemList });
            }
            catch (HttpRequestException httpEx)
            {
                return Json(new { success = false, message = "HTTP request error.", error = httpEx.Message });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "An unexpected error occurred.", error = ex.Message });
            }
        }
        [HttpPost]
        public async Task<IActionResult> SaveOfferItems([FromBody] List<OfferItemsViewModel> offerItems)
        {
            if (offerItems == null || offerItems.Count == 0)
            {
                return Json(new { success = false, message = "Offer items cannot be empty." });
            }

            try
            {
                var content = new StringContent(JsonConvert.SerializeObject(offerItems), Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync("ItemAPI/SaveOfferItems", content);

                if (response.IsSuccessStatusCode)
                {
                    return Json(new { success = true, message = "Offer items saved successfully." });
                }

                return Json(new { success = false, message = "Failed to save offer items. Please try again." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "An error occurred while processing the request.", error = ex.Message });
            }
        }

        public async Task<IActionResult> GetItemsByOfferId(string offerId)
        {
            if (string.IsNullOrWhiteSpace(offerId))
            {
                return Json(new { success = false, message = "Offer ID cannot be empty." });
            }

            try
            {
                var offerResponse = await _httpClient.GetAsync($"ItemAPI/GetOfferById/{offerId}");
                var itemsResponse = await _httpClient.GetAsync($"ItemAPI/GetItemsByOfferId/{offerId}");

                if (!offerResponse.IsSuccessStatusCode || !itemsResponse.IsSuccessStatusCode)
                {
                    return Json(new { success = false, message = "Failed to retrieve offer or item data." });
                }

                var offerData = await offerResponse.Content.ReadAsStringAsync();
                var itemsData = await itemsResponse.Content.ReadAsStringAsync();

                var offerResult = JsonConvert.DeserializeObject<OffersViewModel>(offerData);
                var itemsResult = JsonConvert.DeserializeObject<ItemViewModel>(itemsData);

                var offer = offerResult?.Success == true ? offerResult.Data?.FirstOrDefault() : null;
                var itemList = itemsResult?.Success == true ? itemsResult.Data ?? new List<ItemViewModel>() : new List<ItemViewModel>();

                return Json(new { success = true, offer, items = itemList, message = "Data retrieved successfully." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "An error occurred while processing the request.", error = ex.Message });
            }
        }


    }
}
