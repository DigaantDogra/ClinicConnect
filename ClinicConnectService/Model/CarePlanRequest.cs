using System.ComponentModel.DataAnnotations;

namespace ClinicConnectService.Model
{
    public class CarePlanRequest
    {
        [Required]
        public required string DoctorId { get; set; }

        [Required]
        public required string PatientId { get; set; }

        [Required]
        public required string Condition { get; set; }

        [Required]
        public required string ClinicalGuidance { get; set; }
    }
} 