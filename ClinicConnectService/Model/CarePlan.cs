// CarePlan.cs model
using Google.Cloud.Firestore;

namespace ClinicConnectService.Model
{
    [FirestoreData]
    public class CarePlan
    {
        [FirestoreProperty]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        
        [FirestoreProperty]
        public string DoctorId { get; set; } = string.Empty;
        
        [FirestoreProperty]
        public string PatientId { get; set; } = string.Empty;
        
        [FirestoreProperty]
        public DateTime DateCreated { get; set; } = DateTime.UtcNow;
        
        [FirestoreProperty]
        public string OriginalPrompt { get; set; } = string.Empty;
        
        [FirestoreProperty]
        public string GeneratedPlan { get; set; } = string.Empty;
        
        // Navigation properties
        public Doctor? Doctor { get; set; }
        public Patient? Patient { get; set; }
    }

    [FirestoreData]
    public class CarePlanRequest
    {
        [FirestoreProperty]
        public string DoctorId { get; set; } = string.Empty;
        
        [FirestoreProperty]
        public string PatientId { get; set; } = string.Empty;
        
        [FirestoreProperty]
        public string Prompt { get; set; } = string.Empty;
    }

    [FirestoreData]
    public class CarePlanResponse
    {
        [FirestoreProperty]
        public string CarePlanId { get; set; } = string.Empty;
        
        [FirestoreProperty]
        public string PlanText { get; set; } = string.Empty;
        
        [FirestoreProperty]
        public DateTime GeneratedDate { get; set; } = DateTime.UtcNow;
    }
}