using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace eMedicineWeb.Models
{
    public class ItemViewModel
    {
        public string ItemId { get; set; }
        public string ItemName { get; set; }
        public string ItemNameBN { get; set; }
        public string ItemDescription { get; set; }
        public string ItemDescriptionBN { get; set; }
        public string UnitPrice { get; set; }
        public string OfferPrice { get; set; }
        public string OfferValue { get; set; }
        public string OfferType { get; set; }
        public string MRP { get; set; }
        public string BrandId { get; set; }
        public string BrandName { get; set; }
        public string UnitId { get; set; }
        public string UnitName { get; set; }
        public string SupplierId { get; set; }
        public string SupplierName { get; set; }
        public string ImagePath { get; set; }
        public string PreImagePath { get; set; }
        public string ItemCategoryId { get; set; }
        public string ItemCategoryName { get; set; }
        public string IsActive { get; set; }
        public string CreatedBy { get; set; }
        public string CreatedDate { get; set; }
        public string Updatedby { get; set; }
        public string UpdatedDate { get; set; }
    }
    public class ItemResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public List<ItemViewModel> Data { get; set; }
    }
    public class OffersViewModel
    {       
        public string OfferId { get; set; }
        public string OfferName { get; set; }        
        public string OfferNameBN { get; set; }        
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string OfferDescriptions { get; set; }
        public string OfferDescriptionsBN { get; set; }
        public string OfferType { get; set; }
        public string OfferValue { get; set; }
        public string OfferImagePath { get; set; }
        public string PreImagePath { get; set; }
        public string IsActive { get; set; }
        public string CreatedBy { get; set; }
        public string CreatedDate { get; set; }
        public string Updatedby { get; set; }
        public string UpdatedDate { get; set; }

    }

    public class OffersResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public List<OffersViewModel> Data { get; set; }
    }

    public class OfferItemsViewModel
    {
        public string OfferId { get; set; }
        public string OfferItemId { get; set; } 
        public string MinimumQty { get; set; } 
        public string MaximumQty { get; set; }         
    }
    public class OfferItemsResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public List<OfferItemsViewModel> Data { get; set; }
    }
    public class DiseaseViewModel
    {
        public string DiseaseId { get; set; }
        public string DiseaseName { get; set; }
        public string DiseaseNameBN { get; set; }
        public string DiseaseDescriptions { get; set; }
        public string DiseaseDescriptionsBN { get; set; }
        public string MedicinesID { get; set; }
        public string MedicineNames { get; set; }
        public string MedicineNamesBN { get; set; }
        public string Advice { get; set; }
        public string AdviceBN { get; set; }
        public string UsageRules { get; set; }
        public string UsageRulesBN { get; set; }
        public string IsActive { get; set; }
        public string CreatedBy { get; set; }
        public string CreatedDate { get; set; }
        public string UpdatedBy { get; set; }
        public string UpdatedDate { get; set; }
    }
    public class DiseaseResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public List<DiseaseViewModel> Data { get; set; }
    }

    public class ItemUnitPricesViewModel
    {
        public string ItemId { get; set; }
        public string UnitId { get; set; }
        public string UnitName { get; set; }
        public string UnitQty { get; set; }
        public string SalePrice { get; set; }
        public string PurchasePrice { get; set; }
        public string IsActive { get; set; }
    }
    public class ItemUnitPricesResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public List<ItemUnitPricesViewModel> Data { get; set; }
    }
}