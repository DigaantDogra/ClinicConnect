namespace ClinicConnectService.Models
{
    public class StructuredPrompt
    {
        public required string Profile { get; set; }
        public required string Condition { get; set; }
        public required string Subtype { get; set; }
        public List<string> Comorbidities { get; set; } = new();
    }
} 