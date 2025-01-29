namespace eMedicineAdmin.Models
{
    public class BrandViewModel
    {
        public string BrandId { get; set; }
        public string BrandName { get; set; }
        public string BrandNameBN { get; set; }
        public string CompanyId { get; set; }
        public string CompanyName { get; set; }
        public string GenericId { get; set; }
        public string GenericName { get; set; }
        public string CategoryId { get; set; }
        public string CategoryName { get; set; }
        public string DosageForm { get; set; }
        public string DosageFormBN { get; set; }
        public string Strength { get; set; }
        public string StrengthBN { get; set; }
        public string BrandDescription { get; set; }
        public string BrandDescriptionBN { get; set; }
        public string IsActive { get; set; }
        public string CreatedBy { get; set; }
        public string CreatedDate { get; set; }
        public string Updatedby { get; set; }
        public string UpdatedDate { get; set; }
        public List<BrandViewModel> Data { get; set; } = new List<BrandViewModel>();
        public bool Success { get; set; }
    }
    public class CompanyViewModel
    {
        public string CompanyId { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public string CompanyAddress { get; set; } = string.Empty;
        public string CompanyDescription { get; set; } = string.Empty;
        public string CompanyNameBN { get; set; } = string.Empty;
        public string CompanyAddressBN { get; set; } = string.Empty;
        public string CompanyDescriptionBN { get; set; } = string.Empty;
        public string CompanyPhone { get; set; } = string.Empty;
        public string IsActive { get; set; } = string.Empty;
        public string CreatedBy { get; set; } = string.Empty;
        public string CreatedDate { get; set; } = string.Empty;
        public string Updatedby { get; set; } = string.Empty;
        public string UpdatedDate { get; set; } = string.Empty;

        public List<CompanyViewModel> Data { get; set; } = new List<CompanyViewModel>();
        public bool Success { get; set; }
    }
    public class GenericsViewModel
    {
        public string GenericsId { get; set; }
        public string GenericsName { get; set; }
        public string GenericsNameBN { get; set; }
        public string GenericsDescription { get; set; }
        public string GenericsDescriptionBN { get; set; }
        public string Indications { get; set; }
        public string IndicationsBN { get; set; }
        public string Contraindications { get; set; }
        public string ContraindicationsBN { get; set; }
        public string TherapeuticClass { get; set; }
        public string TherapeuticClassBN { get; set; }
        public string SideEffects { get; set; }
        public string SideEffectsBN { get; set; }
        public string Precautions { get; set; }
        public string PrecautionsBN { get; set; }
        public string Interactions { get; set; }
        public string InteractionsBN { get; set; }
        public string IsActive { get; set; }
        public string CreatedBy { get; set; }
        public string CreatedDate { get; set; }
        public string Updatedby { get; set; }
        public string UpdatedDate { get; set; }
        public List<GenericsViewModel> Data { get; set; } = new List<GenericsViewModel>();
        public bool Success { get; set; }
    }
}
