// CarePlan.cs model
using System.ComponentModel.DataAnnotations;
using Google.Cloud.Firestore;

namespace ClinicConnectService.Model
{
    [FirestoreData]
    public class CarePlan
    {
        [FirestoreProperty]
        public string Id { get; set; } = string.Empty;
        
        [FirestoreProperty]
        public string PatientId { get; set; } = string.Empty;
        
        [FirestoreProperty]
        public string DoctorId { get; set; } = string.Empty;
        
        [FirestoreProperty]
        public string GeneratedCarePlan { get; set; } = string.Empty;
        
        [FirestoreProperty]
        public string Status { get; set; } = "draft";
        
        [FirestoreProperty]
        public string Condition { get; set; } = string.Empty;
        
        [FirestoreProperty]
        public string Notes { get; set; } = string.Empty;
        
        [FirestoreProperty]
        public string DateCreated { get; set; } = string.Empty;
        
        [FirestoreProperty]
        public string ApprovedCarePlan { get; set; } = string.Empty;
        
        [FirestoreProperty]
        public string OriginalPrompt { get; set; } = string.Empty;
        
        // Navigation properties
        public Doctor? Doctor { get; set; }
        public Patient? Patient { get; set; }
    }
}