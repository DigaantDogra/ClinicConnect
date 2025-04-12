// Services/CarePlanService.cs
using System.Net.Http.Json;
using ClinicConnectService.Models;

namespace ClinicConnectService.Services
{
    public class CarePlanService : ICarePlanService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;

        public CarePlanService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
        }

        public async Task<string> GenerateCarePlan(StructuredPrompt prompt)
        {
            try
            {
                var apiUrl = _configuration["ColabApi:BaseUrl"];
                var response = await _httpClient.PostAsJsonAsync(apiUrl, new
                {
                    profile = prompt.Profile,
                    condition = prompt.Condition,
                    subtype = prompt.Subtype,
                    comorbidities = prompt.Comorbidities
                });

                response.EnsureSuccessStatusCode();
                
                var result = await response.Content.ReadFromJsonAsync<BioMistralResponse>();
                return result?.Plan ?? string.Empty;
            }
            catch (Exception ex)
            {
                throw new ApplicationException("Failed to generate care plan", ex);
            }
        }

        private class BioMistralResponse
        {
            public string Plan { get; set; } = string.Empty;
        }
    }
}