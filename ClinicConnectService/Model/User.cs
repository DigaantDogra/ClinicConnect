using Google.Cloud.Firestore;

namespace ClinicConnectService.Model;

[FirestoreData]
public class User
{
    [FirestoreProperty]
    public string Id { get; set; } 
    
    [FirestoreProperty]
    public string UserName { get; set; } = string.Empty;
    
    [FirestoreProperty]
    public string Email { get; set; } = string.Empty;
    
    [FirestoreProperty]
    public string Type { get; set; }
    
    [FirestoreProperty]
    public List<string> AppointmentIds { get; set; } = new List<string>();
    
    [FirestoreProperty]
    public List<Notification>? Notifications { get; set; }
    
}
