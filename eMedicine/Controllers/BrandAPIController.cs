using eMedicine.IRepository;
using eMedicine.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace eMedicine.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BrandAPIController : ControllerBase
    {
        DataSet ds = new DataSet();
        private readonly ICommonRepo repo;
        public BrandAPIController(ICommonRepo repo)
        {
            this.repo = repo;
        }
        [HttpGet("GetAllBrand")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var ds = await repo.GetAll("", "sp_SelectBrand", "GETALLBRAND");


                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return new JsonResult(new { Success = false, Data = new List<Brand>(), Message = "No Brand found." });
                }
                var GetBrandDetails = (from DataRow dr in ds.Tables[0].Rows
                                          select new Brand()
                                          {
                                              BrandId = dr["BrandId"].ToString(),
                                              BrandName = dr["BrandName"].ToString(),
                                              BrandNameBN = dr["BrandNameBN"].ToString(),
                                              CompanyId = dr["CompanyId"].ToString(),
                                              CompanyName = dr["CompanyName"].ToString(),
                                              CategoryId = dr["CategoryId"].ToString(),
                                              CategoryName = dr["CategoryName"].ToString(),
                                              GenericId = dr["GenericId"].ToString(),
                                              GenericName = dr["GenericsName"].ToString(),
                                              DosageForm = dr["DosageForm"].ToString(),
                                              DosageFormBN = dr["DosageFormBN"].ToString(),
                                              Strength = dr["Strength"].ToString(),
                                              StrengthBN = dr["StrengthBN"].ToString(),                                              
                                              BrandDescription = dr["BrandDescription"].ToString(),                                           
                                              BrandDescriptionBN = dr["BrandDescriptionBN"].ToString(),                                              
                                              IsActive = dr["IsActive"].ToString()
                                          }).ToList();
                return new JsonResult(new { Success = true, Data = GetBrandDetails });
            }
            catch (Exception ex)
            {
                return new JsonResult(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while retrieving the Brand.",
                    Details = ex.Message
                });
            }
        }

        [HttpPost("CreateBrand")]
        public async Task<IActionResult> CreateBrand([FromBody] Brand Brand)
        {
            try
            {

                var ds = await this.repo.GetAll("", "sp_EntryBrand", "CREATEBRAND", Brand.BrandId, Brand.BrandName, Brand.BrandNameBN,Brand.CompanyId,
                    Brand.GenericId, Brand.DosageForm, Brand.DosageFormBN, Brand.Strength, Brand.StrengthBN, Brand.BrandDescription, Brand.BrandDescriptionBN, Brand.IsActive, Brand.CreatedBy,
                    Brand.CreatedDate, Brand.CategoryId);

                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return new JsonResult(new { Success = false, Data = new List<Brand>(), Message = "Brand Create Failed." });
                }
                else
                {
                    return new JsonResult(new { Success = true, Data = new List<Brand>(), Message = "Brand Create Successfully." });
                }

            }
            catch (Exception ex)
            {
                return new JsonResult(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while retrieving the Brand.",
                    Details = ex.Message
                });
            }
        }

        [HttpGet("GetBrandById/{BrandId}")]
        public async Task<IActionResult> GetBrandById(string BrandId)
        {
            try
            {
                var ds = await this.repo.GetAll("", "sp_SelectBrand", "GETBRANDBYID", BrandId);
                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return new JsonResult(new { Success = false, Data = new List<Brand>(), Message = "No Brand found." });
                }
                var GetBrandDetails = (from DataRow dr in ds.Tables[0].Rows
                                          select new Brand()
                                          {
                                              BrandId = dr["BrandId"].ToString(),
                                              BrandName = dr["BrandName"].ToString(),
                                              BrandNameBN = dr["BrandNameBN"].ToString(),
                                              CompanyId = dr["CompanyId"].ToString(),
                                              CompanyName = dr["CompanyName"].ToString(),
                                              CategoryId = dr["CategoryId"].ToString(),
                                              CategoryName = dr["CategoryName"].ToString(),
                                              GenericId = dr["GenericId"].ToString(),
                                              GenericName = dr["GenericsName"].ToString(),
                                              DosageForm = dr["DosageForm"].ToString(),
                                              DosageFormBN = dr["DosageFormBN"].ToString(),
                                              Strength = dr["Strength"].ToString(),
                                              StrengthBN = dr["StrengthBN"].ToString(),
                                              BrandDescription = dr["BrandDescription"].ToString(),
                                              BrandDescriptionBN = dr["BrandDescriptionBN"].ToString(),
                                              IsActive = dr["IsActive"].ToString()
                                          }).ToList();

                return new JsonResult(new { Success = true, Data = GetBrandDetails });

            }
            catch (Exception ex)
            {
                return new JsonResult(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while retrieving the Brand.",
                    Details = ex.Message
                });
            }

        }

        [HttpPost("UpdateBrandById")]
        public async Task<IActionResult> UpdateBrandById([FromBody] Brand Brand)
        {
            try
            {

                var ds = await this.repo.GetAll("", "sp_EntryBrand", "UPDATEBRANDBYID", Brand.BrandId, Brand.BrandName, Brand.BrandNameBN, Brand.CompanyId,
                    Brand.GenericId, Brand.DosageForm, Brand.DosageFormBN, Brand.Strength, Brand.StrengthBN, Brand.BrandDescription, Brand.BrandDescriptionBN, Brand.IsActive, Brand.Updatedby,
                    Brand.UpdatedDate, Brand.CategoryId);

                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return new JsonResult(new { Success = false, Data = new List<Brand>(), Message = "Brand Update Failed." });
                }
                else
                {

                    return new JsonResult(new { Success = true, Data = new List<Brand>(), Message = "Brand Update Successfully." });
                }
            }
            catch (Exception ex)
            {
                return new JsonResult(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while retrieving the Brand.",
                    Details = ex.Message
                });
            }
        }

        [HttpGet("GetBrandByGenericId/{GenericId}")]
        public async Task<IActionResult> GetBrandByGenericId(string GenericId)
        {
            try
            {
                var ds = await this.repo.GetAll("", "sp_SelectBrand", "GETBRANDBYGENERICID", GenericId);
                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return new JsonResult(new { Success = false, Data = new List<Brand>(), Message = "No Brand found." });
                }
                var GetBrandDetails = (from DataRow dr in ds.Tables[0].Rows
                                       select new Brand()
                                       {
                                           BrandId = dr["BrandId"].ToString(),
                                           BrandName = dr["BrandName"].ToString(),
                                           BrandNameBN = dr["BrandNameBN"].ToString(),
                                           CompanyId = dr["CompanyId"].ToString(),
                                           CompanyName = dr["CompanyName"].ToString(),
                                           CategoryId = dr["CategoryId"].ToString(),
                                           CategoryName = dr["CategoryName"].ToString(),
                                           GenericId = dr["GenericId"].ToString(),
                                           GenericName = dr["GenericsName"].ToString(),
                                           DosageForm = dr["DosageForm"].ToString(),
                                           DosageFormBN = dr["DosageFormBN"].ToString(),
                                           Strength = dr["Strength"].ToString(),
                                           StrengthBN = dr["StrengthBN"].ToString(),
                                           BrandDescription = dr["BrandDescription"].ToString(),
                                           BrandDescriptionBN = dr["BrandDescriptionBN"].ToString(),
                                           IsActive = dr["IsActive"].ToString()
                                       }).ToList();

                return new JsonResult(new { Success = true, Data = GetBrandDetails });

            }
            catch (Exception ex)
            {
                return new JsonResult(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while retrieving the Brand.",
                    Details = ex.Message
                });
            }

        }

        [HttpGet("GetBrandByCategoryId/{CategoryId}")]
        public async Task<IActionResult> GetBrandByCategoryId(string CategoryId)
        {
            try
            {
                var ds = await this.repo.GetAll("", "sp_SelectBrand", "GETBRANDBYCATEGORYID", CategoryId);
                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return new JsonResult(new { Success = false, Data = new List<Brand>(), Message = "No Brand found." });
                }
                var GetBrandDetails = (from DataRow dr in ds.Tables[0].Rows
                                       select new Brand()
                                       {
                                           BrandId = dr["BrandId"].ToString(),
                                           BrandName = dr["BrandName"].ToString(),
                                           BrandNameBN = dr["BrandNameBN"].ToString(),
                                           CompanyId = dr["CompanyId"].ToString(),
                                           CompanyName = dr["CompanyName"].ToString(),
                                           CategoryId = dr["CategoryId"].ToString(),
                                           CategoryName = dr["CategoryName"].ToString(),
                                           GenericId = dr["GenericId"].ToString(),
                                           GenericName = dr["GenericsName"].ToString(),
                                           DosageForm = dr["DosageForm"].ToString(),
                                           DosageFormBN = dr["DosageFormBN"].ToString(),
                                           Strength = dr["Strength"].ToString(),
                                           StrengthBN = dr["StrengthBN"].ToString(),
                                           BrandDescription = dr["BrandDescription"].ToString(),
                                           BrandDescriptionBN = dr["BrandDescriptionBN"].ToString(),
                                           IsActive = dr["IsActive"].ToString()
                                       }).ToList();

                return new JsonResult(new { Success = true, Data = GetBrandDetails });

            }
            catch (Exception ex)
            {
                return new JsonResult(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while retrieving the Brand.",
                    Details = ex.Message
                });
            }

        }

        [HttpGet("GetBrandByCompanyId/{CompanyId}")]
        public async Task<IActionResult> GetBrandByCompanyId(string CompanyId)
        {
            try
            {
                var ds = await this.repo.GetAll("", "sp_SelectBrand", "GETBRANDBYCOMPANYID", CompanyId);
                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return new JsonResult(new { Success = false, Data = new List<Brand>(), Message = "No Brand found." });
                }
                var GetBrandDetails = (from DataRow dr in ds.Tables[0].Rows
                                       select new Brand()
                                       {
                                           BrandId = dr["BrandId"].ToString(),
                                           BrandName = dr["BrandName"].ToString(),
                                           BrandNameBN = dr["BrandNameBN"].ToString(),
                                           CompanyId = dr["CompanyId"].ToString(),
                                           CompanyName = dr["CompanyName"].ToString(),
                                           CategoryId = dr["CategoryId"].ToString(),
                                           CategoryName = dr["CategoryName"].ToString(),
                                           GenericId = dr["GenericId"].ToString(),
                                           GenericName = dr["GenericsName"].ToString(),
                                           DosageForm = dr["DosageForm"].ToString(),
                                           DosageFormBN = dr["DosageFormBN"].ToString(),
                                           Strength = dr["Strength"].ToString(),
                                           StrengthBN = dr["StrengthBN"].ToString(),
                                           BrandDescription = dr["BrandDescription"].ToString(),
                                           BrandDescriptionBN = dr["BrandDescriptionBN"].ToString(),
                                           IsActive = dr["IsActive"].ToString()
                                       }).ToList();

                return new JsonResult(new { Success = true, Data = GetBrandDetails });

            }
            catch (Exception ex)
            {
                return new JsonResult(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while retrieving the Brand.",
                    Details = ex.Message
                });
            }

        }
    }
}
