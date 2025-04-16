using Google.Cloud.Firestore;

namespace ClinicConnectService.Model;

[FirestoreData]
public class Availability
{
<<<<<<< HEAD
    public string Id { get; set; }
    public string DoctorEmail { get; set; }
    public string Date { get; set; }
    public string TimeSlot { get; set; }
    public bool IsAvailable { get; set; }
=======
    [FirestoreProperty]
    public string Id { get; set; } = Guid.NewGuid().ToString();
    
    [FirestoreProperty]
    public string DoctorId { get; set; } = string.Empty;
    
    [FirestoreProperty]
    public string Date { get; set; } = string.Empty;
    
    [FirestoreProperty]
    public string TimeSlot { get; set; } = string.Empty;
    
    [FirestoreProperty]
    public bool IsAvailable { get; set; } = true;
>>>>>>> Firebase-Integration
}
