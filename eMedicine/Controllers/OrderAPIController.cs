using eMedicine.IRepository;
using eMedicine.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using FastMember;
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

        [HttpPost("SaveOrders")]
        public async Task<IActionResult> SaveOrders([FromBody] List<Order> orders)
        {
            try
            {
                DataTable itemListdt = new DataTable();
                try
                {
                    using (var reader = ObjectReader.Create(orders))
                    {
                        itemListdt.Load(reader);
                    }
                }
                catch (Exception ex)
                {
                    //
                }
                itemListdt.TableName = "Table";

                DataSet dstrnd = new DataSet("dsItemList");
                dstrnd.Tables.Add(itemListdt);

                var ds = await this.repo.SaveUsingDataSet("", "sp_EntryOrder", "CREATEORDER", dstrnd);

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
                    return new JsonResult(new { Success = false, Data = new List<Order>(), Message = "Order Create Failed." });
                }
                foreach (var item in orderItems)
                {
                    var ds = await this.repo.GetAll("", "sp_EntryOrder", "CREATEORDER", item.OrderId, item.ItemId, item.UnitPrice, item.Quantity, item.OrderdBy, item.OrderdDate);
                }
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
                                          MRP = dr["MRP"].ToString(),                                         
                                          ImagePath = dr["ImagePath"].ToString(),                                         
                                          ItemDescription = dr["ItemDescription"].ToString() 
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

        [HttpGet("GetAllOrders")]
        public async Task<IActionResult> GetAllOrders()
        {
            try
            {
                var ds = await repo.GetAll("", "sp_SelectOrder", "GETALLORDERLIST");


                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return new JsonResult(new { Success = false, Data = new List<OrderList>(), Message = "No Order List found." });
                }
                var GetOrderList = (from DataRow dr in ds.Tables[0].Rows
                                       select new OrderList()
                                       {
                                           OrderId = dr["OrderId"].ToString(),
                                           OrderDate = dr["OrderDate"].ToString(),
                                           OrderBy = dr["OrderBy"].ToString(),
                                           CustomerName = dr["CustomerName"].ToString(),
                                           CustomerPhone = dr["CustomerPhone"].ToString(),                                           
                                           SalesPersonName = dr["SalesPersonName"].ToString(),
                                           IsDelivered = dr["IsDelivered"].ToString()                                           
                                       }).ToList();
                return new JsonResult(new { Success = true, Data = GetOrderList });
            }
            catch (Exception ex)
            {
                return new JsonResult(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while retrieving the Order List.",
                    Details = ex.Message
                });
            }
        }

    }
}
