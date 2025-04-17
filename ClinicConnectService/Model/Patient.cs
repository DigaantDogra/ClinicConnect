using Google.Cloud.Firestore;

namespace ClinicConnectService.Model;

[FirestoreData]
public class Patient:User
{
    [FirestoreProperty]
    public int Age { get; set; }

    [FirestoreProperty]
    public string Gender { get; set; } = string.Empty;

    [FirestoreProperty]
    public List<string> CarePlanIds { get; set; } = new List<string>();
    public Patient()
    {
        Type = "Patient";
    }
}
