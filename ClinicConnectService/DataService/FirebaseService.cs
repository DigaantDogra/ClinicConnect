using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Google.Cloud.Firestore;
using System;

namespace ClinicConnectService.DataService;

public class FirebaseService
{
    private static FirestoreDb? _firestoreDb;

    public static void InitializeFirebase()
    {
        if (_firestoreDb == null)
        {
            try
            {
                string credentialsPath = Environment.GetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS") 
                    ?? throw new InvalidOperationException("GOOGLE_APPLICATION_CREDENTIALS environment variable is not set");
                
                string projectId = Environment.GetEnvironmentVariable("PROJECT_ID") 
                    ?? throw new InvalidOperationException("PROJECT_ID environment variable is not set");

                if (!File.Exists(credentialsPath))
                {
                    throw new FileNotFoundException($"Firebase credentials file not found at: {credentialsPath}");
                }

                var credential = GoogleCredential.FromFile(credentialsPath);
                FirebaseApp.Create(new AppOptions()
                {
                    Credential = credential,
                    ProjectId = projectId
                });

                _firestoreDb = FirestoreDb.Create(projectId);
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("Failed to initialize Firebase: " + ex.Message, ex);
            }
        }
    }

    public static FirestoreDb GetFirestoreDb()
    {
        if (_firestoreDb == null)
        {
            throw new InvalidOperationException("Firestore database not initialized. Call InitializeFirebase first.");
        }
        return _firestoreDb;
    }
}
