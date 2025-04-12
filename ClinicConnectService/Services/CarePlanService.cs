// Services/CarePlanService.cs
using System.Net.Http.Json;
using Microsoft.Extensions.Configuration;
using ClinicConnectService.Models;
using Microsoft.Extensions.Logging;

namespace ClinicConnectService.Services
{
    public class CarePlanService : ICarePlanService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly ILogger<CarePlanService> _logger;

        public CarePlanService(HttpClient httpClient, IConfiguration configuration, ILogger<CarePlanService> logger)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<string> GenerateCarePlanAsync(StructuredPrompt prompt)
        {
            try
            {
                _logger.LogInformation("Sending request to FastAPI endpoint");
                
                // Get the API URL from configuration
                var apiUrl = _configuration["ColabApi:BaseUrl"];
                if (string.IsNullOrEmpty(apiUrl))
                {
                    throw new InvalidOperationException("FastAPI endpoint URL is not configured");
                }

                // Send request to the FastAPI endpoint with the correct format
                var response = await _httpClient.PostAsJsonAsync(apiUrl, new
                {
                    profile = prompt.Profile,
                    condition = prompt.Condition,
                    subtype = prompt.Subtype,
                    comorbidities = prompt.Comorbidities
                });
                
                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError("FastAPI returned error: {StatusCode} - {Content}", 
                        response.StatusCode, errorContent);
                    throw new HttpRequestException($"FastAPI returned {response.StatusCode}");
                }

                // Read and return the generated care plan
                var result = await response.Content.ReadFromJsonAsync<FastApiResponse>();
                _logger.LogInformation("Successfully received response from FastAPI");
                
                return result?.Plan ?? string.Empty;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in CarePlanService");
                throw;
            }
        }

        private class FastApiResponse
        {
            public string Plan { get; set; } = string.Empty;
        }
    }
}