using eMedicine.IRepository;
using eMedicine.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace eMedicine.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegistrationAPIController : ControllerBase
    {
        DataSet ds = new DataSet();
        private readonly ICommonRepo repo;
        public RegistrationAPIController(ICommonRepo repo)
        {
            this.repo = repo;
        }     

        [HttpPost("CreateRegistration")]
        public async Task<IActionResult> CreateRegistration([FromBody] Registration Registration)
        {
            try
            {

                var ds = await this.repo.GetAll("", "sp_EntryRegistration", "CREATEREGISTRATION", Registration.PhoneNo, Registration.UserName, Registration.Email, Registration.Password,
                Registration.IsActive, Registration.CreatedBy, Registration.CreatedDate);

                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return new JsonResult(new { Success = false, Data = new List<Registration>(), Message = "Registration Create Failed." });
                }
                else
                {
                    return new JsonResult(new { Success = true, Data = new List<Registration>(), Message = "Registration Create Successfully." });
                }

            }
            catch (Exception ex)
            {
                return new JsonResult(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while retrieving the Registration.",
                    Details = ex.Message
                });
            }
        }
    }
}
