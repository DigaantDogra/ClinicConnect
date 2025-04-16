using Google.Cloud.Firestore;

namespace ClinicConnectService.Model;

[FirestoreData]
public class Patient:User
{
    public Patient()
    {
        Type = "Patient";
    }
}
