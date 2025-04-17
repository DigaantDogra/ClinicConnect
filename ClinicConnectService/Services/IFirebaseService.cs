using Google.Cloud.Firestore;
using System.Linq.Expressions;
using ClinicConnectService.Model;

namespace ClinicConnectService.Services
{
    public interface IFirebaseService
    {
        void InitializeFirebase();
        FirestoreDb GetFirestoreDb();
        
        // Document operations
        Task<T?> GetDocument<T>(string collection, string documentId) where T : class;
        Task AddDocument<T>(string collection, string documentId, T data) where T : class;
        Task UpdateDocument<T>(string collection, string documentId, T data) where T : class;
        Task DeleteDocument(string collection, string documentId);
        
        // Collection operations
        Task<List<T>> GetCollection<T>(string collection) where T : class;
        Task<List<T>> QueryCollection<T>(string collection, string field, object value) where T : class;
        Task<List<T>> QueryCollection<T>(string collection, Expression<Func<T, bool>> predicate) where T : class;

        Task<T> GetDocumentAsync<T>(string collection, string documentId) where T : class;
        Task<List<T>> GetCollectionAsync<T>(string collection) where T : class;
        Task<string> AddDocumentAsync<T>(string collection, T data) where T : class;
        Task UpdateDocumentAsync<T>(string collection, string documentId, T data) where T : class;
        Task DeleteDocumentAsync(string collection, string documentId);
        Task<List<T>> QueryCollectionAsync<T>(string collection, string field, object value) where T : class;
    }
} 