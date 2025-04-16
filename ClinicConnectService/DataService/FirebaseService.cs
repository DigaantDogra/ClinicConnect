using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Google.Cloud.Firestore;
using ClinicConnectService.Service;
using System;
using System.Linq.Expressions;

namespace ClinicConnectService.DataService;

public class FirebaseService : IFirebaseService
{
    private static FirestoreDb? _firestoreDb;

    public void InitializeFirebase()
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

    public FirestoreDb GetFirestoreDb()
    {
        if (_firestoreDb == null)
        {
            throw new InvalidOperationException("Firestore database not initialized. Call InitializeFirebase first.");
        }
        return _firestoreDb;
    }

    public async Task<T?> GetDocument<T>(string collection, string documentId) where T : class
    {
        var db = GetFirestoreDb();
        var docRef = db.Collection(collection).Document(documentId);
        var snapshot = await docRef.GetSnapshotAsync();
        
        if (snapshot.Exists)
        {
            return snapshot.ConvertTo<T>();
        }
        return null;
    }

    public async Task AddDocument<T>(string collection, string documentId, T data) where T : class
    {
        var db = GetFirestoreDb();
        var docRef = db.Collection(collection).Document(documentId);
        await docRef.SetAsync(data);
    }

    public async Task UpdateDocument<T>(string collection, string documentId, T data) where T : class
    {
        var db = GetFirestoreDb();
        var docRef = db.Collection(collection).Document(documentId);
        await docRef.SetAsync(data, SetOptions.MergeAll);
    }

    public async Task DeleteDocument(string collection, string documentId)
    {
        var db = GetFirestoreDb();
        var docRef = db.Collection(collection).Document(documentId);
        await docRef.DeleteAsync();
    }

    public async Task<List<T>> GetCollection<T>(string collection) where T : class
    {
        var db = GetFirestoreDb();
        var snapshot = await db.Collection(collection).GetSnapshotAsync();
        return snapshot.Documents.Select(doc => doc.ConvertTo<T>()).ToList();
    }

    public async Task<List<T>> QueryCollection<T>(string collection, string field, object value) where T : class
    {
        var db = GetFirestoreDb();
        var query = db.Collection(collection).WhereEqualTo(field, value);
        var snapshot = await query.GetSnapshotAsync();
        return snapshot.Documents.Select(doc => doc.ConvertTo<T>()).ToList();
    }

    public async Task<List<T>> QueryCollection<T>(string collection, Expression<Func<T, bool>> predicate) where T : class
    {
        var db = GetFirestoreDb();
        var query = db.Collection(collection);
        // Note: Firestore has limited support for LINQ expressions
        // This is for more complex querying if needed
        var snapshot = await query.GetSnapshotAsync();
        return snapshot.Documents
            .Select(doc => doc.ConvertTo<T>())
            .Where(predicate.Compile())
            .ToList();
    }
}
