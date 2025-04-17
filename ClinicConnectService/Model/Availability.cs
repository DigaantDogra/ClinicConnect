using Google.Cloud.Firestore;

namespace ClinicConnectService.Model;

[FirestoreData]
public class Availability
{
    [FirestoreProperty]
    public string Id { get; set; }
    
    [FirestoreProperty]
    public string DoctorId { get; set; } = string.Empty;
    
    [FirestoreProperty]
    public List<string> Dates { get; set; } = new List<string>();
    
    [FirestoreProperty]
    public List<string> TimeSlots { get; set; } = new List<string>();
    
    [FirestoreProperty]
    public bool IsAvailable { get; set; } = true;
}
