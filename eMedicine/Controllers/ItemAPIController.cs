using eMedicine.IRepository;
using eMedicine.Models;
using FastMember;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
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
        #region Items
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
                                           ImagePath = dr["ImagePath"].ToString(),                                           
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
                    Item.BrandId, Item.UnitId, Item.SupplierId, Item.ItemCategoryId, Item.IsActive, Item.CreatedBy, Item.CreatedDate, Item.UnitPrice, Item.MRP, Item.ImagePath);

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
                                           ImagePath = dr["ImagePath"].ToString(),
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
                    Item.BrandId, Item.UnitId, Item.SupplierId, Item.ItemCategoryId, Item.IsActive, Item.Updatedby, Item.UpdatedDate, Item.UnitPrice, Item.MRP, Item.ImagePath);

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

        [HttpPost("CreateOffer")]
        public async Task<IActionResult> CreateOffer([FromBody] Offers offer)
        {
            try
            {

                var ds = await this.repo.GetAll("", "sp_EntryItem", "CREATEOFFER",offer.OfferId, offer.OfferName, offer.OfferNameBN, offer.StartDate, offer.EndDate, offer.OfferDescriptions,
                    offer.OfferDescriptionsBN,  offer.OfferType, offer.OfferValue, offer.OfferImagePath, offer.IsActive, offer.CreatedBy, offer.CreatedDate);

                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return new JsonResult(new { Success = false, Data = new List<Offers>(), Message = "Offers Create Failed." });
                }
                else
                {
                    return new JsonResult(new { Success = true, Data = new List<Offers>(), Message = "Offers Create Successfully." });
                }

            }
            catch (Exception ex)
            {
                return new JsonResult(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while retrieving the Offers.",
                    Details = ex.Message
                });
            }
        }

        [HttpGet("GetAllIOffers")]
        public async Task<IActionResult> GetAllIOffers()
        {
            try
            {
                var ds = await repo.GetAll("", "sp_SelectItem", "GETALLIOFFERS");


                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return new JsonResult(new { Success = false, Data = new List<Offers>(), Message = "No offers found." });
                }
                var GetItemDetails = (from DataRow dr in ds.Tables[0].Rows
                                      select new Offers()
                                      {
                                          OfferId = dr["OfferId"].ToString(),
                                          OfferName = dr["OfferName"].ToString(),
                                          OfferNameBN = dr["OfferNameBN"].ToString(),
                                          StartDate = dr["StartDate"].ToString(),
                                          EndDate = dr["EndDate"].ToString(),
                                          OfferDescriptions = dr["OfferDescriptions"].ToString(),
                                          OfferDescriptionsBN = dr["OfferDescriptionsBN"].ToString(),
                                          OfferType = dr["OfferType"].ToString(),
                                          OfferValue = dr["OfferValue"].ToString(),
                                          OfferImagePath = dr["OfferImagePath"].ToString(),                                         
                                          IsActive = dr["IsActive"].ToString()
                                      }).ToList();
                return new JsonResult(new { Success = true, Data = GetItemDetails });
            }
            catch (Exception ex)
            {
                return new JsonResult(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while retrieving the offers.",
                    Details = ex.Message
                });
            }
        }

        [HttpGet("GetOfferById/{OfferId}")]
        public async Task<IActionResult> GetOfferById(string OfferId)
        {
            try
            {
                var ds = await this.repo.GetAll("", "sp_SelectItem", "GETOFFERBYID", OfferId);
                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return new JsonResult(new { Success = false, Data = new List<Offers>(), Message = "No offer found." });
                }
                var GetItemDetails = (from DataRow dr in ds.Tables[0].Rows
                                      select new Offers()
                                      {
                                          OfferId = dr["OfferId"].ToString(),
                                          OfferName = dr["OfferName"].ToString(),
                                          OfferNameBN = dr["OfferNameBN"].ToString(),
                                          StartDate = dr["StartDate"].ToString(),
                                          EndDate = dr["EndDate"].ToString(),
                                          OfferDescriptions = dr["OfferDescriptions"].ToString(),
                                          OfferDescriptionsBN = dr["OfferDescriptionsBN"].ToString(),
                                          OfferType = dr["OfferType"].ToString(),
                                          OfferValue = dr["OfferValue"].ToString(),
                                          OfferImagePath = dr["OfferImagePath"].ToString(),
                                          IsActive = dr["IsActive"].ToString()
                                      }).ToList();

                return new JsonResult(new { Success = true, Data = GetItemDetails });

            }
            catch (Exception ex)
            {
                return new JsonResult(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while retrieving the offer.",
                    Details = ex.Message
                });
            }

        }

        [HttpPost("UpdateOfferById")]
        public async Task<IActionResult> UpdateOfferById([FromBody] Offers offer)
        {
            try
            {
                var ds = await this.repo.GetAll("", "sp_EntryItem", "UPDATEOFFERBYID", offer.OfferId, offer.OfferName, offer.OfferNameBN, offer.StartDate, offer.EndDate, offer.OfferDescriptions,
                    offer.OfferDescriptionsBN, offer.OfferType, offer.OfferValue, offer.OfferImagePath, offer.IsActive, offer.Updatedby, offer.UpdatedDate);
                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return new JsonResult(new { Success = false, Data = new List<Offers>(), Message = "Offers Update Failed." });
                }
                else
                {
                    return new JsonResult(new { Success = true, Data = new List<Offers>(), Message = "Offers Update Successfully." });
                }

            }
            catch (Exception ex)
            {
                return new JsonResult(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while retrieving the Offers.",
                    Details = ex.Message
                });
            }
        }
       
        [HttpGet("AddOfferItems/{OfferId}")]
        public async Task<IActionResult> AddOfferItems(string OfferId)
        {
            try
            {
                var ds = await repo.GetAll("", "sp_SelectItem", "ADDOFFERITEMS",OfferId);


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
                                          UnitName = dr["UnitName"].ToString(),
                                          ImagePath = dr["ImagePath"].ToString(),
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

        [HttpPost("SaveOfferItems")]
        public async Task<IActionResult> SaveOfferItems([FromBody] List<OfferItems> offerItems)
        {
            try
            {
                DataTable itemListdt = new DataTable();
                try
                {
                    using (var reader = ObjectReader.Create(offerItems))
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

                var ds = await this.repo.SaveUsingDataSet("", "sp_EntryOrder", "SAVEOFFERITEMS", dstrnd);

                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return new JsonResult(new { Success = false, Data = new List<OfferItems>(), Message = "Items Create Failed." });
                }
                else
                {
                    return new JsonResult(new { Success = true, Data = new List<OfferItems>(), Message = "Items Create Successfully." });
                }

            }
            catch (Exception ex)
            {
                return new JsonResult(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while retrieving the Items.",
                    Details = ex.Message
                });
            }
        }

        [HttpGet("GetItemsByOfferId/{OfferId}")]
        public async Task<IActionResult> GetItemsByOfferId(string OfferId)
        {
            try
            {
                var ds = await repo.GetAll("", "sp_SelectItem", "GETITEMSBYOFFERID", OfferId);


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
                                          OfferPrice = dr["OfferPrice"].ToString(),
                                          OfferValue = dr["OfferValue"].ToString(),
                                          OfferType = dr["OfferType"].ToString(),
                                          MRP = dr["MRP"].ToString(),                                          
                                          ImagePath = dr["ImagePath"].ToString()  
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

        [HttpGet("GetItemsByBrandId/{BrandId}")]
        public async Task<IActionResult> GetItemsByBrandId(string BrandId)
        {
            try
            {
                var ds = await repo.GetAll("", "sp_SelectItem", "GETITEMSBYBRANDID", BrandId);


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
                                          ImagePath = dr["ImagePath"].ToString(),
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
        #endregion

        #region Disease Wise Medicine
        [HttpGet("GetAllDisease")]
        public async Task<IActionResult> GetAllDisease()
        {
            try
            {
                var ds = await repo.GetAll("", "sp_SelectItem", "GETALLDISEASE");


                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return new JsonResult(new { Success = false, Data = new List<Disease>(), Message = "No Disease found." });
                }
                var GetDiseaseDetails = (from DataRow dr in ds.Tables[0].Rows
                                          select new Disease()
                                          {
                                              DiseaseId = dr["DiseaseId"].ToString(),
                                              DiseaseName = dr["DiseaseName"].ToString(),
                                              DiseaseNameBN = dr["DiseaseNameBN"].ToString(),
                                              DiseaseDescriptions = dr["DiseaseDescriptions"].ToString(),
                                              DiseaseDescriptionsBN = dr["DiseaseDescriptionsBN"].ToString(),
                                              MedicinesID = dr["MedicinesID"].ToString(),
                                              Advice = dr["Advice"].ToString(),
                                              AdviceBN = dr["AdviceBN"].ToString(),
                                              UsageRules = dr["UsageRules"].ToString(),
                                              UsageRulesBN = dr["UsageRulesBN"].ToString(),
                                              IsActive = dr["IsActive"].ToString()
                                          }).ToList();
                return new JsonResult(new { Success = true, Data = GetDiseaseDetails });
            }
            catch (Exception ex)
            {
                return new JsonResult(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while retrieving the Disease.",
                    Details = ex.Message
                });
            }
        }

        [HttpPost("CreateDiseaseData")]
        public async Task<IActionResult> CreateDiseaseData([FromBody] Disease Disease)
        {
            try
            {

                var ds = await this.repo.GetAll("", "sp_EntryItem", "CREATEDISEASEDATA", Disease.DiseaseId, Disease.DiseaseName, Disease.DiseaseNameBN, Disease.DiseaseDescriptions,
                    Disease.DiseaseDescriptionsBN, Disease.MedicinesID, Disease.Advice, Disease.AdviceBN, Disease.UsageRules, Disease.UsageRulesBN, Disease.IsActive, Disease.CreatedBy, Disease.CreatedDate);

                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return new JsonResult(new { Success = false, Data = new List<Disease>(), Message = "Disease Create Failed." });
                }
                else
                {
                    return new JsonResult(new { Success = true, Data = new List<Disease>(), Message = "Disease Create Successfully." });
                }

            }
            catch (Exception ex)
            {
                return new JsonResult(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while retrieving the Disease.",
                    Details = ex.Message
                });
            }
        }

        [HttpGet("GetDiseaseById/{DiseaseId}")]
        public async Task<IActionResult> GetDiseaseById(string DiseaseId)
        {
            try
            {
                var ds = await this.repo.GetAll("", "sp_SelectItem", "GETDISEASEBYID", DiseaseId);
                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return new JsonResult(new { Success = false, Data = new List<Disease>(), Message = "No Disease found." });
                }
                var GetDiseaseDetails = (from DataRow dr in ds.Tables[0].Rows
                                          select new Disease()
                                          {
                                              DiseaseId = dr["DiseaseId"].ToString(),
                                              DiseaseName = dr["DiseaseName"].ToString(),
                                              DiseaseNameBN = dr["DiseaseNameBN"].ToString(),
                                              DiseaseDescriptions = dr["DiseaseDescriptions"].ToString(),
                                              DiseaseDescriptionsBN = dr["DiseaseDescriptionsBN"].ToString(),
                                              MedicinesID = dr["MedicinesID"].ToString(),
                                              Advice = dr["Advice"].ToString(),
                                              AdviceBN = dr["AdviceBN"].ToString(),
                                              UsageRules = dr["UsageRules"].ToString(),
                                              UsageRulesBN = dr["UsageRulesBN"].ToString(),
                                              IsActive = dr["IsActive"].ToString()
                                          }).ToList();

                return new JsonResult(new { Success = true, Data = GetDiseaseDetails });

            }
            catch (Exception ex)
            {
                return new JsonResult(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while retrieving the Disease.",
                    Details = ex.Message
                });
            }

        }

        [HttpPost("UpdateDiseaseById")]
        public async Task<IActionResult> UpdateDiseaseById([FromBody] Disease Disease)
        {
            try
            {

                var ds = await this.repo.GetAll("", "sp_EntryItem", "UPDATEDISEASEBYID", Disease.DiseaseId, Disease.DiseaseName, Disease.DiseaseNameBN, Disease.DiseaseDescriptions,
                    Disease.DiseaseDescriptionsBN, Disease.MedicinesID, Disease.Advice, Disease.AdviceBN, Disease.UsageRules, Disease.UsageRulesBN, Disease.IsActive, Disease.UpdatedBy, Disease.UpdatedDate);


                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return new JsonResult(new { Success = false, Data = new List<Disease>(), Message = "Disease Update Failed." });
                }
                else
                {

                    return new JsonResult(new { Success = true, Data = new List<Disease>(), Message = "Disease Update Successfully." });
                }
            }
            catch (Exception ex)
            {
                return new JsonResult(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while retrieving the Disease.",
                    Details = ex.Message
                });
            }
        }
        #endregion

    }
}
