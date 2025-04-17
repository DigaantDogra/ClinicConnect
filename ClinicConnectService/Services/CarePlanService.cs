// Services/CarePlanService.cs
using System.Net.Http.Json;
using Microsoft.Extensions.Configuration;
using ClinicConnectService.Model;
using Microsoft.Extensions.Logging;
using System.Text.Json.Serialization;

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
                _logger.LogInformation("Sending request to FastAPI endpoint with prompt: {@Prompt}", prompt);
                
                // Get the API URL from configuration
                var apiUrl = _configuration["ColabApi:BaseUrl"];
                if (string.IsNullOrEmpty(apiUrl))
                {
                    throw new InvalidOperationException("FastAPI endpoint URL is not configured");
                }
                _logger.LogInformation("Using API URL: {ApiUrl}", apiUrl);

                // Format the request body to match FastAPI's expected format exactly
                var requestBody = new
                {
                    profile = prompt.Profile,
                    condition = prompt.Condition,
                    subtype = prompt.Subtype,
                    comorbidities = prompt.Comorbidities
                };

                _logger.LogInformation("Sending request body to FastAPI: {@RequestBody}", requestBody);

                // Send request to the FastAPI endpoint
                var response = await _httpClient.PostAsJsonAsync($"{apiUrl}/generate", requestBody);
                
                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError("FastAPI returned error: {StatusCode} - {Content}", 
                        response.StatusCode, errorContent);
                    throw new HttpRequestException($"FastAPI returned {response.StatusCode}: {errorContent}");
                }

                // Read and return the generated care plan
                var result = await response.Content.ReadFromJsonAsync<FastApiResponse>();
                if (result == null || string.IsNullOrEmpty(result.Plan))
                {
                    _logger.LogError("FastAPI returned empty or invalid response");
                    throw new InvalidOperationException("FastAPI returned empty or invalid response");
                }

                _logger.LogInformation("Successfully received response from FastAPI");
                return result.Plan;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in CarePlanService: {Message}", ex.Message);
                throw;
            }
        }

        private class FastApiResponse
        {
            [JsonPropertyName("plan")]
            public string Plan { get; set; } = string.Empty;
        }
    }
}