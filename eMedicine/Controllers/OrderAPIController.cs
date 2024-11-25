using eMedicine.IRepository;
using eMedicine.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace eMedicine.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderAPIController : ControllerBase
    {
        DataSet ds = new DataSet();
        private readonly ICommonRepo repo;
        public OrderAPIController(ICommonRepo repo)
        {
            this.repo = repo;
        }


        [HttpPost("SaveOrder")]
        public async Task<IActionResult> SaveOrder([FromBody] Order order)
        {
            try
            {

                var ds = await this.repo.GetAll("", "sp_Entryorder", "CREATEorder", order.Id, order.Name, order.Price, order.Quantity);

                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return new JsonResult(new { Success = false, Data = new List<Order>(), Message = "Order Create Failed." });
                }
                else
                {
                    return new JsonResult(new { Success = true, Data = new List<Order>(), Message = "Order Create Successfully." });
                }

            }
            catch (Exception ex)
            {
                return new JsonResult(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while retrieving the Order.",
                    Details = ex.Message
                });
            }
        }

        [HttpPost("SaveAPIOrderList")]
        public async Task<IActionResult> SaveAPIOrderList([FromBody] List<Order> orderItems)
        {
            try
            {
                if (orderItems == null || orderItems.Count == 0)
                {
                    return new JsonResult(new { Success = false, Data = new List<Brand>(), Message = "Order Create Failed." });
                }
                foreach (var item in orderItems)
                {
                    var ds = await this.repo.GetAll("", "sp_EntryBrand", "CREATEBRAND", item.Id, item.Name, item.Price, item.Quantity);
                }
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

        [HttpGet("GetItems/{item}")]
        public async Task<IActionResult> GetItems(string item)
        {
            try
            {
                var ds = await this.repo.GetAll("", "sp_SelectItem", "GETITEMS", item);
                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return new JsonResult(new { Success = false, Message = "No Menu found.", Data = new List<Item>() });
                }
                var GetItemList = (from DataRow dr in ds.Tables[0].Rows
                                      select new Item()
                                      {
                                          ItemId = dr["ItemId"].ToString(),
                                          ItemName = dr["ItemName"].ToString(),
                                          UnitPrice = dr["UnitPrice"].ToString(),                                         
                                          MRP = dr["MRP"].ToString()                                         
                                      }).ToList();
                return new JsonResult(new { Success = true, Data = GetItemList });

            }
            catch (Exception ex)
            {
                // Log the exception (implement your logging mechanism here)
                return new JsonResult(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while retrieving the item.",
                    Details = ex.Message
                });
            }

        }
    }
}
