using Google.Cloud.Firestore;

namespace ClinicConnectService.Model;

[FirestoreData]
public class Doctor:User
{
    [FirestoreProperty]
    public List<string> AvailabilityIds { get; set; } = new List<string>();
    
    public Doctor()
    {
        Type = "Doctor";
    }
}
