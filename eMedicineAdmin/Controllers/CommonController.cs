using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using eMedicineAdmin.Models;


namespace eMedicineAdmin.Controllers
{
    public class CommonController : Controller
    {
        private readonly HttpClient _httpClient;

        public CommonController(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient("eMedicineClient");
        }
        public ActionResult GenerateCombo(string ProcedureName, string CallName, string Param1, string Param2, string Param3, string Param4, string Param5)
        {
            List<DropdownListViewModel> dropdownList = new List<DropdownListViewModel>();
            try
            {
                string requestUrl = $"{_httpClient.BaseAddress}CommonAPI/GetDropdownList?ProcedureName={ProcedureName}&CallName={CallName}&Param1={Param1}&Param2={Param2}&Param3={Param3}&Param4={Param4}&Param5={Param5}";

                HttpResponseMessage response = _httpClient.GetAsync(requestUrl).Result;
                if (!response.IsSuccessStatusCode)
                {
                    return Json(new
                    {
                        success = false,
                        message = "Failed to retrieve dropdown list. Please try again later."
                    });
                }

                string responseData = response.Content.ReadAsStringAsync().Result;
                var dropdownResponse = JsonConvert.DeserializeObject<DropdownListViewModel>(responseData);
                if (dropdownResponse?.Success == true)
                {
                    dropdownList = dropdownResponse.Data ?? new List<DropdownListViewModel>();
                }
                else
                {
                    return Json(new
                    {
                        success = false,
                        message = "Dropdown list is empty or could not be loaded."
                    });
                }
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    success = false,
                    message = $"An error occurred: {ex.Message}"
                });
            }
            return Json(new { success = true, data = dropdownList });
        }
    }
}
