// CarePlan.cs model
namespace ClinicConnectService.Model
{
    public class CarePlan
    {
        public int Id { get; set; }
        public int DoctorId { get; set; }
        public int PatientId { get; set; }
        public DateTime DateCreated { get; set; } = DateTime.UtcNow;
        public required string OriginalPrompt { get; set; }
        public required string GeneratedPlan { get; set; }
        
        // Navigation properties
        public Doctor? Doctor { get; set; }
        public Patient? Patient { get; set; }
    }

    public class CarePlanRequest
    {
        public int DoctorId { get; set; }
        public int PatientId { get; set; }
        public required string Prompt { get; set; }
    }

    public class CarePlanResponse
    {
        public int CarePlanId { get; set; }
        public string? PlanText { get; set; }
        public DateTime GeneratedDate { get; set; }
    }
}