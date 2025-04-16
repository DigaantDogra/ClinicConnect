using Google.Cloud.Firestore;

namespace ClinicConnectService.Model;

[FirestoreData]
public class Appointment
{
<<<<<<< HEAD
    public string Id { get; set; }
    public string PatientEmail { get; set; }
    public string DoctorEmail { get; set; }
    public string Date { get; set; }
    public string TimeSlot { get; set; }
    public string Reason { get; set; }
    public bool IsConfirmed { get; set; }
=======
    [FirestoreProperty]
    public string Id { get; set; } = Guid.NewGuid().ToString();
    
    [FirestoreProperty]
    public string Date { get; set; } = string.Empty;
    
    [FirestoreProperty]
    public string TimeSlot { get; set; } = string.Empty;
    
    [FirestoreProperty]
    public string Reason { get; set; } = string.Empty;
    
    [FirestoreProperty]
    public string PatientId { get; set; } = string.Empty;
    
    [FirestoreProperty]
    public string DoctorId { get; set; } = string.Empty;
    
    [FirestoreProperty]
    public bool IsConfirmed { get; set; } = false;
>>>>>>> Firebase-Integration
}
