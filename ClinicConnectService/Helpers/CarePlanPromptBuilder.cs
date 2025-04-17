using ClinicConnectService.Model;

namespace ClinicConnectService.Helpers
{
    public static class CarePlanPromptBuilder
    {
        public static StructuredPrompt Build(string rawPrompt)
        {
            // Implement your prompt parsing/structuring logic here
            // This could use regex/NLP to extract medical entities
            // For academic purposes, return sample structured data
            return new StructuredPrompt
            {
                Profile = "65yo Male, T2DM, HbA1c 8.5%, CKD Stage 3, Hypertension",
                Condition = "diabetes",
                Subtype = "Type 2",
                Comorbidities = new List<string> { "CKD Stage 3", "Hypertension" }
            };
        }
    }
}