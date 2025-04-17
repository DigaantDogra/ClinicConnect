using Google.Cloud.Firestore;
using System.ComponentModel.DataAnnotations;

namespace ClinicConnectService.Model;

[FirestoreData]
public class Availability
{
    [Required]
    [FirestoreProperty]
    public required string Id { get; set; }
    
    [FirestoreProperty]
    public string DoctorId { get; set; } = string.Empty;
    
    [FirestoreProperty]
    public List<string> Dates { get; set; } = new List<string>();
    
    [FirestoreProperty]
    public List<string> TimeSlots { get; set; } = new List<string>();
    
    [FirestoreProperty]
    public bool IsAvailable { get; set; } = true;
}
