using Google.Cloud.Firestore;

namespace ClinicConnectService.Model;

[FirestoreData]
public class User
{
    [FirestoreProperty]
    public string Id { get; set; } = string.Empty;
    
    [FirestoreProperty]
    public required string UserName { get; set; }
    
    [FirestoreProperty]
    public required string Email { get; set; }
    
    [FirestoreProperty]
    public required string Type { get; set; }
    
    [FirestoreProperty]
    public List<string> AppointmentIds { get; set; } = new List<string>();
    
    [FirestoreProperty]
    public List<Notification>? Notifications { get; set; }
    
}
