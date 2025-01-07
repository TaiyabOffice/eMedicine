using Microsoft.AspNetCore.Mvc;
using eMedicineAdmin.Models;
using Newtonsoft.Json;

namespace eMedicineAdmin.Controllers
{
    public class DashBoardController : Controller
    {
        public IActionResult Dashboard()
        {
            string menuDataJson = HttpContext.Session.GetString("MenuData");
            var menuLists = string.IsNullOrEmpty(menuDataJson)
                ? new List<MenuViewModel>()
                : JsonConvert.DeserializeObject<List<MenuViewModel>>(menuDataJson);

            ViewBag.MenuData = menuLists;
            return View();
        }
    }
}
