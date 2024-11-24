using eMedicine.IRepository;
using eMedicine.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace eMedicine.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemAPIController : ControllerBase
    {
        DataSet ds = new DataSet();
        private readonly ICommonRepo repo;
        public ItemAPIController(ICommonRepo repo)
        {
            this.repo = repo;
        }
        [HttpGet("GetAllItem")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var ds = await repo.GetAll("", "sp_SelectItem", "GETALLITEM");


                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return new JsonResult(new { Success = false, Data = new List<Item>(), Message = "No Item found." });
                }
                var GetItemDetails = (from DataRow dr in ds.Tables[0].Rows
                                       select new Item()
                                       {
                                           ItemId = dr["ItemId"].ToString(),
                                           ItemName = dr["ItemName"].ToString(),
                                           ItemNameBN = dr["ItemNameBN"].ToString(),
                                           ItemDescription = dr["ItemDescription"].ToString(),
                                           ItemDescriptionBN = dr["ItemDescriptionBN"].ToString(),
                                           UnitPrice = dr["UnitPrice"].ToString(),
                                           MRP = dr["MRP"].ToString(),
                                           BrandName = dr["BrandName"].ToString(),                                          
                                           UnitName = dr["UnitName"].ToString(),                                          
                                           SupplierName = dr["SupplierName"].ToString(),                                           
                                           ItemCategoryName = dr["ItemCategoryName"].ToString(),                                           
                                           IsActive = dr["IsActive"].ToString()
                                       }).ToList();
                return new JsonResult(new { Success = true, Data = GetItemDetails });
            }
            catch (Exception ex)
            {
                return new JsonResult(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while retrieving the Item.",
                    Details = ex.Message
                });
            }
        }

        [HttpPost("CreateItem")]
        public async Task<IActionResult> CreateItem([FromBody] Item Item)
        {
            try
            {

                var ds = await this.repo.GetAll("", "sp_EntryItem", "CREATEITEM", Item.ItemId, Item.ItemName, Item.ItemNameBN, Item.ItemDescription, Item.ItemDescriptionBN, 
                    Item.BrandId, Item.UnitId, Item.SupplierId, Item.ItemCategoryId, Item.IsActive, Item.CreatedBy, Item.CreatedDate, Item.UnitPrice, Item.MRP);

                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return new JsonResult(new { Success = false, Data = new List<Item>(), Message = "Item Create Failed." });
                }
                else
                {
                    return new JsonResult(new { Success = true, Data = new List<Item>(), Message = "Item Create Successfully." });
                }

            }
            catch (Exception ex)
            {
                return new JsonResult(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while retrieving the Item.",
                    Details = ex.Message
                });
            }
        }

        [HttpGet("GetItemById/{ItemId}")]
        public async Task<IActionResult> GetItemById(string ItemId)
        {
            try
            {
                var ds = await this.repo.GetAll("", "sp_SelectItem", "GETITEMBYID", ItemId);
                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return new JsonResult(new { Success = false, Data = new List<Item>(), Message = "No Item found." });
                }
                var GetItemDetails = (from DataRow dr in ds.Tables[0].Rows
                                       select new Item()
                                       {
                                           ItemId = dr["ItemId"].ToString(),
                                           ItemName = dr["ItemName"].ToString(),
                                           ItemNameBN = dr["ItemNameBN"].ToString(),
                                           ItemDescription = dr["ItemDescription"].ToString(),
                                           ItemDescriptionBN = dr["ItemDescriptionBN"].ToString(),
                                           UnitPrice = dr["UnitPrice"].ToString(),
                                           MRP = dr["MRP"].ToString(),
                                           BrandId = dr["BrandId"].ToString(),
                                           BrandName = dr["BrandName"].ToString(),
                                           UnitId = dr["UnitId"].ToString(),
                                           UnitName = dr["UnitName"].ToString(),
                                           SupplierId = dr["SupplierId"].ToString(),
                                           SupplierName = dr["SupplierName"].ToString(),
                                           ItemCategoryId = dr["ItemCategoryId"].ToString(),
                                           ItemCategoryName = dr["ItemCategoryName"].ToString(),
                                           IsActive = dr["IsActive"].ToString()
                                       }).ToList();

                return new JsonResult(new { Success = true, Data = GetItemDetails });

            }
            catch (Exception ex)
            {
                return new JsonResult(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while retrieving the Item.",
                    Details = ex.Message
                });
            }

        }

        [HttpPost("UpdateItemById")]
        public async Task<IActionResult> UpdateItemById([FromBody] Item Item)
        {
            try
            {

                var ds = await this.repo.GetAll("", "sp_EntryItem", "UPDATEITEMBYID", Item.ItemId, Item.ItemName, Item.ItemNameBN, Item.ItemDescription, Item.ItemDescriptionBN,
                    Item.BrandId, Item.UnitId, Item.SupplierId, Item.ItemCategoryId, Item.IsActive, Item.Updatedby, Item.UpdatedDate, Item.UnitPrice, Item.MRP);

                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return new JsonResult(new { Success = false, Data = new List<Item>(), Message = "Item Update Failed." });
                }
                else
                {

                    return new JsonResult(new { Success = true, Data = new List<Item>(), Message = "Item Update Successfully." });
                }
            }
            catch (Exception ex)
            {
                return new JsonResult(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while retrieving the Item.",
                    Details = ex.Message
                });
            }
        }
    }
}
