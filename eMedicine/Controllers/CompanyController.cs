using eMedicine.IRepository;
using eMedicine.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace eMedicine.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompanyController : ControllerBase
    {
        DataSet ds = new DataSet();
        private readonly ICommonRepo repo;
        public CompanyController(ICommonRepo repo)
        {
            this.repo = repo;

        }    

        [HttpGet("GetAllCompany")]
        public async Task<IActionResult> GetAll()
        {
            var ds = await this.repo.GetAll("", "sp_SelectCompany", "GETALLCOMPANY");
            var GetDashBoardDetails = (from DataRow dr in ds.Tables[0].Rows
                                       select new EntityDefaultParameter()
                                       {
                                           DESC1 = dr["DESC1"].ToString(),
                                           DESC2 = dr["DESC2"].ToString(),
                                           DESC3 = dr["DESC3"].ToString()                                           
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
        public async Task<IActionResult> CreateCompany([FromBody] EntityDefaultParameter DefaultParameter)
        {
            bool status = false;
            var ds = await this.repo.GetAll("", "sp_EntryCompany", "CREATECOMPANY", DefaultParameter.DESC1, DefaultParameter.DESC2, DefaultParameter.DESC3);
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
