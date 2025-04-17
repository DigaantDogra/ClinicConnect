using System.ComponentModel.DataAnnotations;

namespace ClinicConnectService.Model
{
    public class EditCarePlanRequest
    {
        [Required]
        public string CarePlanId { get; set; } = string.Empty;
        
        [Required]
        public string DoctorId { get; set; } = string.Empty;
        
        [Required]
        public string Plan { get; set; } = string.Empty;
    }
} 