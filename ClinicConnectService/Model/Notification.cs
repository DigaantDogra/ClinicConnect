using Google.Cloud.Firestore;

namespace ClinicConnectService.Model;

[FirestoreData]
public class Notification
{
    [FirestoreProperty]
    public string Id { get; set; } = Guid.NewGuid().ToString();
    
    [FirestoreProperty]
    public string Title { get; set; } = string.Empty;
    
    [FirestoreProperty]
    public string Message { get; set; } = string.Empty;
    
    [FirestoreProperty]
    public string UserId { get; set; } = string.Empty;
    
    [FirestoreProperty]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    [FirestoreProperty]
    public bool IsRead { get; set; } = false;
}
