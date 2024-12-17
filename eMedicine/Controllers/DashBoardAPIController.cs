using eMedicine.IRepository;
using eMedicine.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace eMedicine.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashBoardAPIController : ControllerBase
    {
        DataSet ds = new DataSet();
        private readonly ICommonRepo repo;
        public DashBoardAPIController(ICommonRepo repo)
        {
            this.repo = repo;
        }

        [HttpGet("GetDashBoardDetails")]
        public async Task<IActionResult> GetDashBoardDetails()
        {
            try
            {
                var ds = await repo.GetAll("", "sp_SelectDashboard", "GETDASHBOARDDETAILS");

                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return new JsonResult(new { Success = false, Data = new List<EntityDefaultParameter>(), Message = "No DashBoard data found." });
                }
                var GetDashboardDetails = (from DataRow dr in ds.Tables[0].Rows
                                         select new EntityDefaultParameter()
                                         {
                                             DESC1 = dr["TtlActItem"].ToString(),
                                             DESC2 = dr["TtlInActItem"].ToString(),
                                             DESC3 = dr["TtlInActCompany"].ToString(),
                                             DESC4 = dr["TtlActCompany"].ToString(),
                                             DESC5 = dr["TtlInActBrand"].ToString(),
                                             DESC6 = dr["TtlActBrand"].ToString(),
                                             DESC7 = dr["TtlInActGenerics"].ToString(),
                                             DESC8 = dr["TtlActGenerics"].ToString(),
                                             DESC9 = dr["TtlInActCat"].ToString(),
                                             DESC10 = dr["TtlActCat"].ToString(),
                                             DESC11 = dr["TtlInActMCat"].ToString(),
                                             DESC12 = dr["TtlActMCat"].ToString(),
                                             DESC13 = dr["TtlActOrders"].ToString(),
                                             DESC14 = dr["TtlRecOrders"].ToString(),
                                             DESC15 = dr["TtlDelOrders"].ToString(),
                                             DESC16 = dr["TtlActSalesP"].ToString(),
                                             DESC17 = dr["TtlInActSalesP"].ToString(),
                                             DESC18 = dr["TtlInActSupl"].ToString(),
                                             DESC19 = dr["TtlActSupl"].ToString(),
                                             DESC20 = dr["TtlInActUser"].ToString(),
                                             DESC21 = dr["TtlActUser"].ToString()
                                         }).ToList();
                return new JsonResult(new { Success = true, Data = GetDashboardDetails });
            }
            catch (Exception ex)
            {
                return new JsonResult(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while retrieving the DashBoard.",
                    Details = ex.Message
                });
            }
        }
    }
}
