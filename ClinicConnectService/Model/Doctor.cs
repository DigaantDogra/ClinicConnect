using Google.Cloud.Firestore;

namespace ClinicConnectService.Model;

[FirestoreData]
public class Doctor
{
    [FirestoreProperty]
    public string Id { get; set; } = string.Empty;
    
    [FirestoreProperty]
    public string UserName { get; set; } = string.Empty;
    
    [FirestoreProperty]
    public string Email { get; set; } = string.Empty;
    
    [FirestoreProperty]
    public List<string> AppointmentIds { get; set; } = new List<string>();
    
    [FirestoreProperty]
    public List<string> AvailabilityIds { get; set; } = new List<string>();
    
    [FirestoreProperty]
    public List<Notification>? Notifications { get; set; }
    
    [FirestoreProperty]
    public string UserType { get; set; } = "Doctor";
}
