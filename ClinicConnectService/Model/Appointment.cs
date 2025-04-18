using Google.Cloud.Firestore;
using System.ComponentModel.DataAnnotations;

namespace ClinicConnectService.Model;

[FirestoreData]
public class Appointment
{
    [Required]
    [FirestoreProperty]
    public required string Id { get; set; }
    
    [FirestoreProperty]
    public string PatientId { get; set; } = string.Empty;
    
    [FirestoreProperty]
    public string DoctorId { get; set; } = string.Empty;
    
    [FirestoreProperty]
    public string Date { get; set; } = string.Empty;
    
    [FirestoreProperty]
    public string TimeSlot { get; set; } = string.Empty;
    
    [FirestoreProperty]
    public string Reason { get; set; } = string.Empty;
    
    [FirestoreProperty]
    public bool IsConfirmed { get; set; } = false;
}
