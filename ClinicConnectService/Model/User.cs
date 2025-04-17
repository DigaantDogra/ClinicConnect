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
    public required string UserName { get; set; }
    
    [FirestoreProperty]
    public required string Email { get; set; }
    
    [FirestoreProperty]
<<<<<<< HEAD
=======
    public string Password { get; set; }
    
    [Required]
    [FirestoreProperty]
>>>>>>> main
    public required string Type { get; set; }
    
    [FirestoreProperty]
    public List<string> AppointmentIds { get; set; } = new List<string>();
    
    [FirestoreProperty]
    public List<Notification>? Notifications { get; set; }
    
}
