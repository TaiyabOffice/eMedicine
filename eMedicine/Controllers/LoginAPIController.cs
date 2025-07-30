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
    public class LoginAPIController : ControllerBase
    {
        DataSet ds = new DataSet();
        private readonly ICommonRepo repo;
        public DataSet MenuData = new DataSet();
        public LoginAPIController(ICommonRepo repo)
        {
            this.repo = repo;
        }

        [HttpGet("LogIn")]
        public async Task<IActionResult> LogIn(string UserName, string UserPassword)
        {
            try
            {
                bool status = false;
                string UserNameR = StrReverse(UserName.ToUpper());
                string UserPass = EncodeMD5(UserPassword);


                // Call stored procedure to get all companies
                var ds = await repo.GetAll("", "sp_SelectLogin", "LOGINUSER", UserName.ToUpper(), UserPass);

                // Check if dataset is valid and contains data
                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return new JsonResult(new { Success = false, Message = "No user found.", Data = new List<Login>() });
                } 
                var GetLoginDetails = (from DataRow dr in ds.Tables[0].Rows
                                           select new Login()
                                           {
                                               UserId = dr["UserId"].ToString(),
                                               UserName = dr["UserName"].ToString(),                                               
                                               Email = dr["Email"].ToString(),
                                               PhoneNumber = dr["PhoneNumber"].ToString()                                                                                             
                                           }).ToList();
                return new JsonResult(new { Success = true, Data = GetLoginDetails });
            }
            catch (Exception ex)
            {
                // Log the exception (implement your logging mechanism here)
                return new JsonResult(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while retrieving the login.",
                    Details = ex.Message
                });
            }
        }

        [HttpGet("GetMenuById/{UserId}")]
        public async Task<IActionResult> GetMenuById(string UserId)
        {
            try
            {
                var ds = await this.repo.GetAll("", "sp_SelectLogin", "GETMENUBYID", UserId);
                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return new JsonResult(new { Success = false, Message = "No Menu found.", Data = new List<Menu>() });
                }
                var GetMenuDetails = (from DataRow dr in ds.Tables[0].Rows
                                           select new Menu()
                                           {
                                               MenuID = dr["MenuID"].ToString(),
                                               ParentID = dr["ParentID"].ToString(),
                                               MenuName = dr["MenuName"].ToString(),
                                               PageName = dr["PageName"].ToString(),
                                               PageUrl = dr["PageUrl"].ToString(),
                                               MenuSequenceNo = dr["MenuSequenceNo"].ToString()                                              
                                           }).ToList();              
                return new JsonResult(new { Success = true, Data = GetMenuDetails });

            }
            catch (Exception ex)
            {
                // Log the exception (implement your logging mechanism here)
                return new JsonResult(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while retrieving the Menu.",
                    Details = ex.Message
                });
            }

        }

        [HttpGet("GetAppMenu")]
        public async Task<IActionResult> GetAppMenu()
        {
            try
            {
                var ds = await this.repo.GetAll("", "sp_SelectLogin", "GETAPPMENUS");
                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return new JsonResult(new { Success = false, Message = "No Menu found.", Data = new List<Menu>() });
                }
                var GetMenuDetails = (from DataRow dr in ds.Tables[0].Rows
                                      select new Menu()
                                      {
                                          MenuID = dr["MenuID"].ToString(),                                         
                                          MenuName = dr["MenuName"].ToString(),
                                          MenuNameBN = dr["MenuNameBN"].ToString(),
                                          PageName = dr["PageName"].ToString(),
                                          PageUrl = dr["PageUrl"].ToString(),                                        
                                          ImagePath = dr["ImagePath"].ToString()
                                      }).ToList();
                return new JsonResult(new { Success = true, Data = GetMenuDetails });

            }
            catch (Exception ex)
            {
                // Log the exception (implement your logging mechanism here)
                return new JsonResult(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while retrieving the Menu.",
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
