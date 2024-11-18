using eMedicine.IRepository;
using eMedicine.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Security.Cryptography;
using System.Text;

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
                bool status = false;                
                string UserPass = EncodeMD5(Registration.Password);

                var ds = await this.repo.GetAll("", "sp_EntryRegistration", "CREATEREGISTRATION", Registration.PhoneNumber, Registration.UserName, Registration.Email, UserPass,
                Registration.DistrictId, Registration.UpazilasId, Registration.IsActive);

                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return new JsonResult(new { Success = false, Data = new List<Registration>(), Message = "Registration Failed." });
                }
                else
                {
                    return new JsonResult(new { Success = true, Data = new List<Registration>(), Message = "Registration Successfully." });
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

        public static string EncodeMD5(string originalStr)
        {
            Byte[] originalBytes;
            Byte[] encodedBytes;
            MD5 md5 = new MD5CryptoServiceProvider();
            originalBytes = ASCIIEncoding.Default.GetBytes(originalStr);
            encodedBytes = md5.ComputeHash(originalBytes);
            return BitConverter.ToString(encodedBytes);
        }
        public static string StrReverse(string s)
        {
            char[] arr = s.ToCharArray();
            Array.Reverse(arr);
            return new string(arr);
        }
    }
}
