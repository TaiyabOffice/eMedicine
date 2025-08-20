using eMedicine.IRepository;
using eMedicine.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace eMedicine.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportAPIController : ControllerBase
    {
        DataSet ds = new DataSet();
        private readonly ICommonRepo repo;
        EntityReportsParams objReportParams = new EntityReportsParams();
        public ReportAPIController(ICommonRepo repo)
        {
            this.repo = repo;
        }   

        [HttpPost("PrintReportData")]
        public async Task<IActionResult> PrintReportData([FromBody] EntityDefaultParameter objDBParameter)
        {
            try
            {
                var tables = new Dictionary<string, object>();
                var ds = await this.repo.GetAll("", objDBParameter.PROCNAME, objDBParameter.CALLTYPE, objDBParameter.DESC1, objDBParameter.DESC2, objDBParameter.DESC3,
                    objDBParameter.DESC4, objDBParameter.DESC5, objDBParameter.DESC6, objDBParameter.DESC7, objDBParameter.DESC8, objDBParameter.DESC9, objDBParameter.DESC10);           

                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return new JsonResult(new { Success = false, Data = new List<EntityDefaultParameter>(), Message = "Failed." });
                }
                else
                {    
                    foreach (DataTable table in ds.Tables)
                    {
                        var rows = table.AsEnumerable()
                            .Select(r => table.Columns.Cast<DataColumn>()
                                .ToDictionary(c => c.ColumnName, c => r[c]))
                            .ToList();

                        tables[table.TableName ?? "Table" + ds.Tables.IndexOf(table)] = rows;
                    }

                    return new JsonResult(new { Success = true, Data = tables, Message = "Successfully." });
                }
            }
            catch (Exception ex)
            {
                return new JsonResult(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while retrieving the Data.",
                    Details = ex.Message
                });
            }
        }
    }
}
