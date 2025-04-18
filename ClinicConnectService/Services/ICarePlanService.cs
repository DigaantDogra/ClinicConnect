// Services/ICarePlanService.cs
using ClinicConnectService.Models;

namespace ClinicConnectService.Services
{
    public interface ICarePlanService
    {
        Task<string> GenerateCarePlanAsync(StructuredPrompt prompt);
    }
}