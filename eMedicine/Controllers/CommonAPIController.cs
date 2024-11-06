using eMedicine.IRepository;
using eMedicine.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace eMedicine.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommonAPIController : ControllerBase
    {
        DataSet ds = new DataSet();
        private readonly ICommonRepo repo;

        public CommonAPIController(ICommonRepo repo)
        {
            this.repo = repo;
        }
        [HttpGet("GetDropdownList")]
        public async Task<IActionResult> GetDropdownList(string ProcedureName, string CallName, string Param1, string Param2, string Param3, string Param4, string Param5)
        {
            try
            {
                var ds = await repo.GetAll("", ProcedureName, CallName, Param1, Param2, Param3, Param4, Param5);

                // Check if dataset is valid and contains data
                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return Ok(new { Success = false, Message = "No List found." });
                }
                var GetDropdownList = (from DataRow dr in ds.Tables[0].Rows
                                       select new DropdownList()
                                       {
                                           Id = dr["Id"].ToString(),
                                           Name = dr["Name"].ToString()
                                       }).ToList();
                return new JsonResult(GetDropdownList);
            }
            catch (Exception ex)
            {
                // Log the exception (implement your logging mechanism here)
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while retrieving the List.",
                    Details = ex.Message
                });
            }
        }
    }
}
