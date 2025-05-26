namespace eMedicine.Models
{
    public class Item
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
        public string ItemCategoryId { get; set; }
        public string ItemCategoryName { get; set; }        
        public string IsActive { get; set; }
        public string CreatedBy { get; set; }
        public string CreatedDate { get; set; }
        public string Updatedby { get; set; }
        public string UpdatedDate { get; set; }

    }

    public class Offers
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
        public string IsActive { get; set; }
        public string CreatedBy { get; set; }
        public string CreatedDate { get; set; }
        public string Updatedby { get; set; }
        public string UpdatedDate { get; set; }

    }
    public class OfferItems
    {
        public string OfferId { get; set; }
        public string OfferItemId { get; set; }
        public string MinimumQty { get; set; }
        public string MaximumQty { get; set; }        
    }

    public class Disease
    {
        public string DiseaseId { get; set; }
        public string DiseaseName { get; set; }
        public string DiseaseNameBN { get; set; }
        public string DiseaseDescriptions { get; set; }
        public string DiseaseDescriptionsBN { get; set; }
        public string MedicinesID { get; set; }
        public string Advice { get; set; }
        public string AdviceBN { get; set; }
        public string IsActive { get; set; }
        public string CreatedBy { get; set; }
        public string CreatedDate { get; set; }
        public string UpdatedBy { get; set; }
        public string UpdatedDate { get; set; }
    }

}
