using Google.Cloud.Firestore;
using System.Collections.Generic;

namespace ClinicConnectService.Model
{
    [FirestoreData]
    public class MedicalHistory
    {
        [FirestoreProperty]
        public string ConditionSubtype { get; set; } = string.Empty;

        [FirestoreProperty]
        public List<string> Comorbidities { get; set; } = new List<string>();
    }
} 