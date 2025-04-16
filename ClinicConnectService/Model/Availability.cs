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
    public string Date { get; set; } = string.Empty;
    
    [FirestoreProperty]
    public string TimeSlot { get; set; } = string.Empty;
    
    [FirestoreProperty]
    public bool IsAvailable { get; set; } = true;
}
