using eMedicine.IRepository;
using eMedicine.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace eMedicine.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SalesPersonAPIController : ControllerBase
    {
        DataSet ds = new DataSet();
        private readonly ICommonRepo repo;
        public SalesPersonAPIController(ICommonRepo repo)
        {
            this.repo = repo;
        }
        [HttpGet("GetAllSalesPerson")]
        public async Task<IActionResult> GetAll()
        {
            try
            {               
                var ds = await repo.GetAll("", "sp_SelectSalesPerson", "GETALLSALESPERSON");

                
                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {                   
                    return new JsonResult(new { Success = false, Data = new List<SalesPerson>(), Message = "SNo Sales Person found." });
                }
                var GetSalesPersonDetails = (from DataRow dr in ds.Tables[0].Rows
                                           select new SalesPerson()
                                           {
                                               SalesPersonId = dr["SalesPersonId"].ToString(),
                                               SalesPersonName = dr["SalesPersonName"].ToString(),
                                               SalesPersonDescription = dr["SalesPersonDescription"].ToString(),
                                               SalesPersonPhone = dr["SalesPersonPhone"].ToString(),
                                               CompanyId = dr["CompanyId"].ToString(),
                                               CompanyName = dr["CompanyName"].ToString(),
                                               IsActive = dr["IsActive"].ToString()
                                           }).ToList();               
                return new JsonResult(new { Success = true, Data = GetSalesPersonDetails });
            }
            catch (Exception ex)
            {              
                return new JsonResult(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while retrieving the Sales Person.",
                    Details = ex.Message
                });
            }
        }
        [HttpPost("CreateSalesPerson")]
        public async Task<IActionResult> CreateSalesPerson([FromBody] SalesPerson salesPerson)
        {
            try
            {  
                bool status = false;
                var ds = await this.repo.GetAll("", "sp_EntrySalesPerson", "CREATESALESPERSON", salesPerson.SalesPersonId, salesPerson.SalesPersonName, salesPerson.SalesPersonDescription,
                salesPerson.SalesPersonPhone, salesPerson.CreatedBy, salesPerson.CreatedDate, salesPerson.UpdatedBy, salesPerson.UpdatedDate, salesPerson.IsActive, salesPerson.CompanyId);

                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return new JsonResult(new { Success = false, Data = new List<SalesPerson>(), Message = "sales Person Create Failed." });
                }
                else
                {
                    return new JsonResult(new { Success = true, Data = new List<SalesPerson>(), Message = "sales Person Create Successfully." });
                }

            }
            catch (Exception ex)
            {             
                return new JsonResult(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while retrieving the Sales Person.",
                    Details = ex.Message
                });
            }
        }
        [HttpGet("GetSalesPersonById/{SalesPersonId}")]
        public async Task<IActionResult> GetSalesPersonById(string SalesPersonId)
        {
            try
            {
                var ds = await this.repo.GetAll("", "sp_SelectSalesPerson", "GETSALESPERSONBYID", SalesPersonId);
                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return Ok(new { Success = true, Data = new List<SalesPerson>(), Message = "No Sales Person found." });
                }
                var GetSalesPersonDetails = (from DataRow dr in ds.Tables[0].Rows
                                           select new SalesPerson()
                                           {
                                               SalesPersonId = dr["SalesPersonId"].ToString(),
                                               SalesPersonName = dr["SalesPersonName"].ToString(),
                                               SalesPersonDescription = dr["SalesPersonDescription"].ToString(),
                                               SalesPersonPhone = dr["SalesPersonPhone"].ToString(),
                                               CompanyId = dr["CompanyId"].ToString(),
                                               CompanyName = dr["CompanyName"].ToString(),                                                                                            
                                               IsActive = dr["IsActive"].ToString()
                                           }).ToList();

                return new JsonResult(GetSalesPersonDetails);

            }
            catch (Exception ex)
            {                
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while retrieving the Sales Person.",
                    Details = ex.Message
                });
            }

        }
        [HttpPost("UpdateSalesPersonById")]
        public async Task<IActionResult> UpdateSalesPersonById([FromBody] SalesPerson salesPerson)
        {
            try
            {
                bool status = false;
                var ds = await this.repo.GetAll("", "sp_EntrySalesPerson", "UPDATESALESPERSONBYID", salesPerson.SalesPersonId, salesPerson.SalesPersonName, salesPerson.SalesPersonDescription,
                salesPerson.SalesPersonPhone, salesPerson.CreatedBy, salesPerson.CreatedDate, salesPerson.UpdatedBy, salesPerson.UpdatedDate, salesPerson.IsActive, salesPerson.CompanyId);


                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return new JsonResult(new { Success = false, Data = new List<SalesPerson>(), Message = "sales Person Update Failed." });
                }
                else
                {
                    return new JsonResult(new { Success = true, Data = new List<SalesPerson>(), Message = "sales Person Update Successfully." });
                }
            }
            catch (Exception ex)
            {               
                return new JsonResult(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while retrieving the Sales Person.",
                    Details = ex.Message
                });
            }
        }
    }
}
