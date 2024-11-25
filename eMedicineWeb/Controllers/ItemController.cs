using eMedicineWeb.Models;
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
    public class ItemController : Controller
    {
        // GET: Item
        Uri baseAddress = new Uri(ConfigurationManager.AppSettings["ServerURL"] + "ItemAPI");
        HttpClient client;
        public ItemController()
        {
            client = new HttpClient();
            client.BaseAddress = baseAddress;
        }

        public ActionResult UIEntryItem()
        {
            return View();
        }

        public ActionResult UIItemList()
        {
            return View();
        }
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
        public async Task<ActionResult> CreateItem(ItemViewModel Item)
        {

            if (!ModelState.IsValid)
            {
                return Json(new { success = false, message = "Failed Insert Item details." });
            }
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
        public async Task<ActionResult> UpdateItemById(ItemViewModel Item)
        {
            bool Satus = false;
            if (!ModelState.IsValid)
            {
                return Json(new { success = false, message = "Failed Insert Item details." });
            }
            string data = JsonConvert.SerializeObject(Item);
            StringContent content = new StringContent(data, Encoding.UTF8, "application/json");

            HttpResponseMessage response = await client.PostAsync(client.BaseAddress + "/UpdateItemById", content);

            if (response.IsSuccessStatusCode)
            {
                return Json(new { success = true, message = "Item update Successfully" });
            }
            ModelState.AddModelError("", "Unable to update Item. Please try again.");
            return Json(new { success = false, message = "Failed to retrieve Item details." });
        }
    }
}