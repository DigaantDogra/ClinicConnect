using System.ComponentModel.DataAnnotations;

namespace ClinicConnectService.Model
{
    public class ApproveCarePlanRequest
    {
        [Required]
        public string CarePlanId { get; set; } = string.Empty;
        
        [Required]
        public string DoctorId { get; set; } = string.Empty;
        
        public string? Notes { get; set; }
    }
} 