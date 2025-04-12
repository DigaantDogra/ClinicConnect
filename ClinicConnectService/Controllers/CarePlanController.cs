// Controllers/CarePlanController.cs
using Microsoft.AspNetCore.Mvc;
using ClinicConnectService.Services;
using ClinicConnectService.Helpers;

namespace ClinicConnectService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CarePlanController : ControllerBase
    {
        private readonly ICarePlanService _carePlanService;

        public CarePlanController(ICarePlanService carePlanService)
        {
            _carePlanService = carePlanService;
        }

        [HttpPost]
        public async Task<ActionResult<string>> GenerateCarePlan([FromBody] string rawPrompt)
        {
            try
            {
                // Get structured prompt for BioMistral
                var structuredPrompt = CarePlanPromptBuilder.Build(rawPrompt);

                // Call Colab API
                var generatedPlan = await _carePlanService.GenerateCarePlan(structuredPrompt);

                return Ok(generatedPlan);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error generating care plan: {ex.Message}");
            }
        }
    }
}