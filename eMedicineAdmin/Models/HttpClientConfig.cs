using System.ComponentModel.DataAnnotations;

namespace eMedicineAdmin.Models
{
    public class HttpClientConfig
    {
        [Required]
        [Url]
        public string BaseAddress { get; set; }
        [Required]
        public string UserAgent { get; set; }
        [Required]
        public string Accept { get; set; }
    }
}
