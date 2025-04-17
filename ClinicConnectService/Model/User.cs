using Google.Cloud.Firestore;
using System.ComponentModel.DataAnnotations;

namespace ClinicConnectService.Model;

[FirestoreData]
public class User
{
    [Required]
    [FirestoreProperty]
    public required string Id { get; set; }
    
    [FirestoreProperty]
    public string UserName { get; set; } = string.Empty;
    
    [FirestoreProperty]
    public string Email { get; set; } = string.Empty;
    
    [FirestoreProperty]
    public string Password { get; set; } = string.Empty;
    
    [Required]
    [FirestoreProperty]
    public required string Type { get; set; }
    
    [FirestoreProperty]
    public List<string> AppointmentIds { get; set; } = new List<string>();
    
    [FirestoreProperty]
    public List<Notification>? Notifications { get; set; }
    
}
