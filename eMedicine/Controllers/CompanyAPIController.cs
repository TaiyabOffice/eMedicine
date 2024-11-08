using eMedicine.IRepository;
using eMedicine.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace eMedicine.Controllers
{
    [Route("api/[controller]/")]
    [ApiController]
    public class CompanyAPIController : ControllerBase
    {
        DataSet ds = new DataSet();
        private readonly ICommonRepo repo;
        public CompanyAPIController(ICommonRepo repo)
        {
            this.repo = repo;
        }
        [HttpGet("GetAllCompany")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var ds = await repo.GetAll("", "sp_SelectCompany", "GETALLCOMPANY");

                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return new JsonResult(new { Success = false, Data = new List<Company>(), Message = "No Company found." });
                }
                var GetCompanyDetails = (from DataRow dr in ds.Tables[0].Rows
                                           select new Company()
                                           {
                                               CompanyId = dr["CompanyId"].ToString(),
                                               CompanyName = dr["CompanyName"].ToString(),
                                               CompanyAddress = dr["CompanyAddress"].ToString(),
                                               CompanyDescription = dr["CompanyDescription"].ToString(),
                                               CompanyPhone = dr["CompanyPhone"].ToString(),                                               
                                               IsActive = dr["IsActive"].ToString()
                                           }).ToList();
                return new JsonResult(new { Success = true, Data = GetCompanyDetails });
            }
            catch (Exception ex)
            {
               return new JsonResult(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while retrieving the companies.",
                    Details = ex.Message
                });
            }
        }
        [HttpPost("CreateCompany")]
        public async Task<IActionResult> CreateCompany([FromBody] Company company)
        {
            try
            {
                // Call stored procedure to get all companies

                bool status = false;
                var ds = await this.repo.GetAll("", "sp_EntryCompany", "CREATECOMPANY", company.CompanyId, company.CompanyName, company.CompanyAddress,
                company.CompanyDescription, company.CompanyPhone, company.IsActive, company.CreatedBy, company.CreatedDate, company.Updatedby, company.UpdatedDate);

                // Check if dataset is valid and contains data
                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return new JsonResult(new { Success = false, Data = new List<Company>(), Message = "Company Create Failed." });
                }
                else
                {
                    return new JsonResult(new { Success = true, Data = new List<Company>(), Message = "Company Create Successfully." });
                }

            }
            catch (Exception ex)
            {
                // Log the exception (implement your logging mechanism here)
                return new JsonResult(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while retrieving the companies.",
                    Details = ex.Message
                });
            }
        }
        [HttpGet("GetCompanyById/{CompanyId}")]
        public async Task<IActionResult> GetCompanyById(string CompanyId)
        {
            try
            {
                var ds = await this.repo.GetAll("", "sp_SelectCompany", "GETCOMPANYBYID", CompanyId);
                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return new JsonResult(new { Success = false, Data = new List<Supplier>(), Message = "No Company found." });
                }
                var GetCompanyDetails = (from DataRow dr in ds.Tables[0].Rows
                                           select new Company()
                                           {
                                               CompanyId = dr["CompanyId"].ToString(),
                                               CompanyName = dr["CompanyName"].ToString(),
                                               CompanyAddress = dr["CompanyAddress"].ToString(),
                                               CompanyDescription = dr["CompanyDescription"].ToString(),
                                               CompanyPhone = dr["CompanyPhone"].ToString(),                                              
                                               IsActive = dr["IsActive"].ToString()
                                           }).ToList();
                return new JsonResult(new { Success = true, Data = GetCompanyDetails });

            }
            catch (Exception ex)
            {
                // Log the exception (implement your logging mechanism here)
                return new JsonResult(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while retrieving the companies.",
                    Details = ex.Message
                });
            }

        }
        [HttpPost("UpdateCompanyById")]
        public async Task<IActionResult> UpdateCompanyById([FromBody] Company company)

        {
            try
            {
                // Call stored procedure to get all companies

                bool status = false;
                var ds = await this.repo.GetAll("", "sp_EntryCompany", "UPDATECOMPANYBYID", company.CompanyId, company.CompanyName, company.CompanyAddress,
                company.CompanyDescription, company.CompanyPhone, company.IsActive,company.CreatedBy, company.CreatedDate, company.Updatedby,company.UpdatedDate);

                // Check if dataset is valid and contains data
                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return new JsonResult(new { Success = false, Data = new List<Company>(), Message = "Company Update Failed." });
                }
                else
                {
                    return new JsonResult(new { Success = true, Data = new List<Company>(), Message = "Company Update Successfully." });
                }

            }
            catch (Exception ex)
            {
                // Log the exception (implement your logging mechanism here)
                return new JsonResult(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while retrieving the companies.",
                    Details = ex.Message
                });
            }
        }
    }
}
