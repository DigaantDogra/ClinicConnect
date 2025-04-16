namespace ClinicConnectService.Models
{
    public class StructuredPrompt
    {
        public string Profile { get; set; } = string.Empty;
        public string Condition { get; set; } = string.Empty;
        public string Subtype { get; set; } = string.Empty;
        public List<string> Comorbidities { get; set; } = new List<string>();
    }
} 