// Controllers/CarePlanController.cs
using Microsoft.AspNetCore.Mvc;
using ClinicConnectService.Services;
using ClinicConnectService.Models;

namespace ClinicConnectService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CarePlanController : ControllerBase
    {
        private readonly ICarePlanService _carePlanService;
        private readonly ILogger<CarePlanController> _logger;

        public CarePlanController(ICarePlanService carePlanService, ILogger<CarePlanController> logger)
        {
            _carePlanService = carePlanService;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> GenerateCarePlan([FromBody] StructuredPrompt prompt)
        {
            try
            {
                _logger.LogInformation("Received request to generate care plan");
                
                // Generate care plan using the service
                var carePlan = await _carePlanService.GenerateCarePlanAsync(prompt);
                
                _logger.LogInformation("Successfully generated care plan");
                return Ok(new { plan = carePlan });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating care plan");
                return StatusCode(500, new { error = "An error occurred while generating the care plan" });
            }
        }
    }
}