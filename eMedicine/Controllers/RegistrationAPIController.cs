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

        [HttpGet("GetAllUser")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var ds = await repo.GetAll("", "sp_SelectLogin", "GETALLUSERS");


                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return new JsonResult(new { Success = false, Data = new List<Registration>(), Message = "No user found." });
                }
                var GetUserDetails = (from DataRow dr in ds.Tables[0].Rows
                                       select new Registration()
                                       {
                                           UserName = dr["UserName"].ToString(),
                                           PhoneNumber = dr["PhoneNumber"].ToString(),
                                           Email = dr["Email"].ToString(),
                                           DistrictName = dr["DistrictName"].ToString(),
                                           UpazilasName = dr["UpazilasName"].ToString(),                                         
                                           IsActive = dr["IsActive"].ToString()
                                       }).ToList();
                return new JsonResult(new { Success = true, Data = GetUserDetails });
            }
            catch (Exception ex)
            {
                return new JsonResult(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while retrieving the User.",
                    Details = ex.Message
                });
            }
        }

        [HttpGet("UpdateUserById")]
        public async Task<IActionResult> UpdateUserById(string UserId, string isActive)
        {
            try
            {
                bool status = false;                 
                var ds = await repo.GetAll("", "sp_EntryRegistration", "UPDATEUSERBYID", UserId, isActive);
               
                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    status = false;
                    return new JsonResult(status);
                }
                else
                {
                    status = true;
                    return new JsonResult(status);
                }
               
            }
            catch (Exception ex)
            {              
                return new JsonResult(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while retrieving the login.",
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

        [HttpGet("RecoverPassword")]
        public async Task<IActionResult> RecoverPassword(string PhoneNumber, string UserPass)
        {
            try
            {
                bool status = false;               
                var ds = await repo.GetAll("", "sp_EntryRegistration", "RECOVERPASSWORD", PhoneNumber, EncodeMD5(UserPass));
              
                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    status = false;
                    return new JsonResult(status);
                }
                else if (ds.Tables[0].Rows[0]["UserId"].ToString() == "NE")
                {
                    status = false;                   
                    return new JsonResult(new { Success = false, Message = "NE" });
                }
                else
                {
                    status = true;
                    return new JsonResult(status);
                }
                
            }
            catch (Exception ex)
            {                
                return new JsonResult(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while retrieving the Password.",
                    Details = ex.Message
                });
            }
        }
    }
}
