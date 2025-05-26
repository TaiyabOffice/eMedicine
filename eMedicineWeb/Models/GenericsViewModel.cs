using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace eMedicineWeb.Models
{
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
    }
    public class GenericsResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public List<GenericsViewModel> Data { get; set; }
    }
}