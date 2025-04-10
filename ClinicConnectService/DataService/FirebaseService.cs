namespace ClinicConnectService.DataService;

public class FirebaseService
{
    public static FirebaseService InitializeFirebase()
    {
        if (FirebaseService.DefaultInstance == null)
        {
            var app = FirebaseService.Create(new AppOptions()
            {
                Credential = GoogleCredential.FromFile("path/to/firebase-adminsdk.json"),
                DatabaseUrl = new Uri("https://your-database-name.firebaseio.com")
            });

            return app;
        }

        return FirebaseService.DefaultInstance;
    }
}
