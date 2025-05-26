using eMedicine.IRepository;
using eMedicine.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace eMedicine.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SupplierAPIController : ControllerBase
    {
        DataSet ds = new DataSet();
        private readonly ICommonRepo repo;
        public SupplierAPIController(ICommonRepo repo)
        {
            this.repo = repo;
        }
        [HttpGet("GetAllSupplier")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var ds = await repo.GetAll("", "sp_SelectSupplier", "GETALLSUPPLIER");


                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return new JsonResult(new { Success = false, Data = new List<Supplier>(), Message = "No Supplier found." });
                }
                var GetSupplierDetails = (from DataRow dr in ds.Tables[0].Rows
                                             select new Supplier()
                                             {
                                                 SupplierId = dr["SupplierId"].ToString(),
                                                 SupplierName = dr["SupplierName"].ToString(),
                                                 ContactPerson = dr["ContactPerson"].ToString(),
                                                 SupplierPhone = dr["SupplierPhone"].ToString(),
                                                 CompanyId = dr["CompanyId"].ToString(),
                                                 CompanyName = dr["CompanyName"].ToString(),
                                                 Email = dr["Email"].ToString(),
                                                 IsActive = dr["IsActive"].ToString()
                                             }).ToList();                
                return new JsonResult(new { Success = true, Data = GetSupplierDetails });
            }
            catch (Exception ex)
            {
                return new JsonResult(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while retrieving the Supplier.",
                    Details = ex.Message
                });
            }
        }

        [HttpPost("CreateSupplier")]
        public async Task<IActionResult> CreateSupplier([FromBody] Supplier Supplier)
        {
            try
            {
                
                var ds = await this.repo.GetAll("", "sp_EntrySupplier", "CREATESUPPLIER", Supplier.SupplierId, Supplier.SupplierName, Supplier.ContactPerson,
                    Supplier.SupplierPhone, Supplier.Email, Supplier.CompanyId, Supplier.IsActive, Supplier.CreatedBy, Supplier.CreatedDate);

                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return new JsonResult(new { Success = false, Data = new List<Supplier>(), Message = "Supplier Create Failed." });
                }
                else
                {
                    return new JsonResult(new { Success = true, Data = new List<Supplier>(), Message = "Supplier Create Successfully." });
                }

            }
            catch (Exception ex)
            {
                return new JsonResult(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while retrieving the Supplier.",
                    Details = ex.Message
                });
            }
        }

        [HttpGet("GetSupplierById/{SupplierId}")]
        public async Task<IActionResult> GetSupplierById(string SupplierId)
        {
            try
            {
                var ds = await this.repo.GetAll("", "sp_SelectSupplier", "GETSUPPLIERBYID", SupplierId);
                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return new JsonResult(new { Success = false, Data = new List<Supplier>(), Message = "No Supplier found." });
                }
                var GetSupplierDetails = (from DataRow dr in ds.Tables[0].Rows
                                             select new Supplier()
                                             {
                                                 SupplierId = dr["SupplierId"].ToString(),
                                                 SupplierName = dr["SupplierName"].ToString(),
                                                 ContactPerson = dr["ContactPerson"].ToString(),
                                                 SupplierPhone = dr["SupplierPhone"].ToString(),
                                                 CompanyId = dr["CompanyId"].ToString(),
                                                 CompanyName = dr["CompanyName"].ToString(),
                                                 Email = dr["Email"].ToString(),
                                                 IsActive = dr["IsActive"].ToString()
                                             }).ToList();

                return new JsonResult(new { Success = true, Data = GetSupplierDetails });

            }
            catch (Exception ex)
            {
                return new JsonResult(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while retrieving the Supplier.",
                    Details = ex.Message
                });
            }

        }

        [HttpPost("UpdateSupplierById")]
        public async Task<IActionResult> UpdateSupplierById([FromBody] Supplier Supplier)
        {
            try
            {
                
                var ds = await this.repo.GetAll("", "sp_EntrySupplier", "UPDATESUPPLIERBYID", Supplier.SupplierId, Supplier.SupplierName, Supplier.ContactPerson,
                    Supplier.SupplierPhone, Supplier.Email, Supplier.CompanyId, Supplier.IsActive, Supplier.UpdatedBy, Supplier.UpdatedDate);


                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {                    
                    return new JsonResult(new { Success = false, Data = new List<Supplier>(), Message = "Supplier Update Failed." });
                }
                else
                {
                                     
                    return new JsonResult(new { Success = true, Data = new List<Supplier>(), Message = "Supplier Update Successfully." });
                }
            }
            catch (Exception ex)
            {
                return new JsonResult(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while retrieving the Supplier.",
                    Details = ex.Message
                });
            }
        }
    }
}
