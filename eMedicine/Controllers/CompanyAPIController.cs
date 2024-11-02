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
            var ds = await this.repo.GetAll("", "sp_SelectCompany", "GETALLCOMPANY");
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

            if (ds != null)
            {
                return new JsonResult(GetDashBoardDetails);
            }
            else
            {
                return NotFound();
            }
        }

        [HttpPost("CreateCompany")]
        public async Task<IActionResult> CreateCompany(Company company)
        {
            bool status = false;
            var ds = await this.repo.GetAll("", "sp_EntryCompany", "CREATECOMPANY", company.CompanyId, company.CompanyName, company.CompanyAddress,
                company.CompanyDescription, company.CompanyPhone, company.CompanyCity, company.CompanyRegion, company.CompanyPostalCode, company.CompanyCountry,
                company.IsActive);
            if (ds != null)
            {
                if (ds.Tables[0].Rows.Count > 0)
                {

                    status = true;
                }
                return Ok(status);
            }
            else
            {
                return NotFound();
            }
        }
    }
}
