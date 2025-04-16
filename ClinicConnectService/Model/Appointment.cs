using Google.Cloud.Firestore;

namespace ClinicConnectService.Model;

[FirestoreData]
public class Appointment
{
    [FirestoreProperty]
    public string Id { get; set; } = Guid.NewGuid().ToString();
    
    [FirestoreProperty]
    public string PatientEmail { get; set; } = string.Empty;
    
    [FirestoreProperty]
    public string DoctorEmail { get; set; } = string.Empty;
    
    [FirestoreProperty]
    public string Date { get; set; } = string.Empty;
    
    [FirestoreProperty]
    public string TimeSlot { get; set; } = string.Empty;
    
    [FirestoreProperty]
    public string Reason { get; set; } = string.Empty;
    
    [FirestoreProperty]
    public bool IsConfirmed { get; set; } = false;
}
