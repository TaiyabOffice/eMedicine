namespace eMedicineAdmin.Models
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
        public List<ItemViewModel> Data { get; set; } = new List<ItemViewModel>();
        public bool Success { get; set; }
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
        public List<OffersViewModel> Data { get; set; } = new List<OffersViewModel>();
        public bool Success { get; set; }

    }
    public class OfferItemsViewModel
    {
        public string OfferId { get; set; }
        public string OfferItemId { get; set; }
        public string MinimumQty { get; set; }
        public string MaximumQty { get; set; }
        public List<OfferItemsViewModel> Data { get; set; } = new List<OfferItemsViewModel>();
        public bool Success { get; set; }
    }

    public class OrderViewModel
    {
        public string OrderId { get; set; }
        public string ItemId { get; set; }
        public string Name { get; set; }
        public string Quantity { get; set; }
        public string UnitPrice { get; set; }
        public string OrderdBy { get; set; }
        public string OrderdDate { get; set; }

        public List<OrderViewModel> Data { get; set; } = new List<OrderViewModel>();
        public bool Success { get; set; }
    }

    public class OrderListViewModel
    {
        public string OrderId { get; set; }
        public string OrderDate { get; set; }
        public string OrderBy { get; set; }
        public string CustomerName { get; set; }
        public string CustomerPhone { get; set; }
        public string Remarks { get; set; }
        public string SalesPersonName { get; set; }
        public string IsDelivered { get; set; }
        public string ItemId { get; set; }
        public string Name { get; set; }
        public string Quantity { get; set; }
        public string UnitPrice { get; set; }
        public string Total { get; set; }
        public string RowId { get; set; }

        public List<OrderListViewModel> Data { get; set; } = new List<OrderListViewModel>();
        public bool Success { get; set; }

    }
}
