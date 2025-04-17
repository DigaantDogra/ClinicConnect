// Services/ICarePlanService.cs
using ClinicConnectService.Model;

namespace ClinicConnectService.Services
{
    public interface ICarePlanService
    {
        Task<string> GenerateCarePlanAsync(StructuredPrompt prompt);
    }
}