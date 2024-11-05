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
                // Call stored procedure to get all companies
                var ds = await repo.GetAll("", "sp_SelectCompany", "GETALLCOMPANY");

                // Check if dataset is valid and contains data
                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return Ok(new { Success = true, Data = new List<Company>(), Message = "No companies found." });
                }
                var GetDashBoardDetails = (from DataRow dr in ds.Tables[0].Rows
                                           select new Company()
                                           {
                                               CompanyId = dr["CompanyId"].ToString(),
                                               CompanyName = dr["CompanyName"].ToString(),
                                               CompanyAddress = dr["CompanyAddress"].ToString(),
                                               CompanyDescription = dr["CompanyDescription"].ToString(),
                                               CompanyPhone = dr["CompanyPhone"].ToString(),
                                               CompanyCity = dr["CompanyCity"].ToString(),
                                               CompanyRegion = dr["CompanyRegion"].ToString(),
                                               CompanyPostalCode = dr["CompanyPostalCode"].ToString(),
                                               CompanyCountry = dr["CompanyCountry"].ToString(),
                                               IsActive = dr["IsActive"].ToString()
                                           }).ToList();
                return new JsonResult(GetDashBoardDetails);
            }
            catch (Exception ex)
            {
                // Log the exception (implement your logging mechanism here)
                return StatusCode(StatusCodes.Status500InternalServerError, new
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
                company.CompanyDescription, company.CompanyPhone, company.CompanyCity, company.CompanyRegion, company.CompanyPostalCode, company.CompanyCountry,
                company.IsActive);

                // Check if dataset is valid and contains data
                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return NotFound();
                }
                else
                {
                    status = true;
                    return Ok(status);
                }

            }
            catch (Exception ex)
            {
                // Log the exception (implement your logging mechanism here)
                return StatusCode(StatusCodes.Status500InternalServerError, new
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
                    return Ok(new { Success = true, Data = new List<Company>(), Message = "No companies found." });
                }
                var GetDashBoardDetails = (from DataRow dr in ds.Tables[0].Rows
                                           select new Company()
                                           {
                                               CompanyId = dr["CompanyId"].ToString(),
                                               CompanyName = dr["CompanyName"].ToString(),
                                               CompanyAddress = dr["CompanyAddress"].ToString(),
                                               CompanyDescription = dr["CompanyDescription"].ToString(),
                                               CompanyPhone = dr["CompanyPhone"].ToString(),
                                               CompanyCity = dr["CompanyCity"].ToString(),
                                               CompanyRegion = dr["CompanyRegion"].ToString(),
                                               CompanyPostalCode = dr["CompanyPostalCode"].ToString(),
                                               CompanyCountry = dr["CompanyCountry"].ToString(),
                                               IsActive = dr["IsActive"].ToString()
                                           }).ToList();

                return new JsonResult(GetDashBoardDetails);

            }
            catch (Exception ex)
            {
                // Log the exception (implement your logging mechanism here)
                return StatusCode(StatusCodes.Status500InternalServerError, new
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
                company.CompanyDescription, company.CompanyPhone, company.CompanyCity, company.CompanyRegion, company.CompanyPostalCode, company.CompanyCountry,
                company.IsActive);

                // Check if dataset is valid and contains data
                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return NotFound();
                }
                else
                {
                    status = true;
                    return Ok(status);
                }

            }
            catch (Exception ex)
            {
                // Log the exception (implement your logging mechanism here)
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while retrieving the companies.",
                    Details = ex.Message
                });
            }
        }




    }
}
