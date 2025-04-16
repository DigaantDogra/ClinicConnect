// Controllers/CarePlanController.cs
using Microsoft.AspNetCore.Mvc;
using ClinicConnectService.Services;
using ClinicConnectService.Models;
using System.Threading.Tasks;
using System;
using System.Linq.Expressions;
using System.Linq;

namespace ClinicConnectService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CarePlanController : ControllerBase
    {
        private readonly ICarePlanService _carePlanService;
        private readonly IFirebaseService _firebaseService;
        private readonly ILogger<CarePlanController> _logger;
        private const string COLLECTION_NAME = "careplans";

        public CarePlanController(ICarePlanService carePlanService, IFirebaseService firebaseService, ILogger<CarePlanController> logger)
        {
            _carePlanService = carePlanService;
            _firebaseService = firebaseService;
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

        [HttpPost("doctor/generate")]
        public async Task<IActionResult> GenerateCarePlan([FromBody] CarePlanRequest request)
        {
            try
            {
                var carePlan = await _carePlanService.GenerateCarePlan(request.PatientCondition);
                
                // Create a new CarePlan object
                var newCarePlan = new CarePlan
                {
                    DoctorId = request.DoctorId,
                    PatientId = request.PatientId,
                    Plan = carePlan,
                    Status = "draft",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                
                // Generate a unique document ID
                string documentId = Guid.NewGuid().ToString();
                
                // Save to Firebase using generic AddDocument method
                await _firebaseService.AddDocument(COLLECTION_NAME, documentId, newCarePlan);

                return Ok(new { carePlan = newCarePlan });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating care plan");
                return StatusCode(500, $"Error generating care plan: {ex.Message}");
            }
        }

        [HttpPut("doctor/edit/{carePlanId}")]
        public async Task<IActionResult> EditCarePlan(string carePlanId, [FromBody] EditCarePlanRequest request)
        {
            try
            {
                // Get existing care plan using generic GetDocument method
                var existingPlan = await _firebaseService.GetDocument<CarePlan>(COLLECTION_NAME, carePlanId);
                if (existingPlan == null || existingPlan.DoctorId != request.DoctorId)
                {
                    return NotFound("Care plan not found or unauthorized");
                }

                // Update the care plan
                existingPlan.Plan = request.UpdatedPlan;
                existingPlan.UpdatedAt = DateTime.UtcNow;
                existingPlan.Status = "draft";

                // Save updated plan to Firebase using generic UpdateDocument method
                await _firebaseService.UpdateDocument(COLLECTION_NAME, carePlanId, existingPlan);

                return Ok(new { message = "Care plan updated successfully", carePlan = existingPlan });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating care plan");
                return StatusCode(500, $"Error updating care plan: {ex.Message}");
            }
        }

        [HttpPut("doctor/approve/{carePlanId}")]
        public async Task<IActionResult> ApproveCarePlan(string carePlanId, [FromBody] ApproveCarePlanRequest request)
        {
            try
            {
                // Get existing care plan using generic GetDocument method
                var existingPlan = await _firebaseService.GetDocument<CarePlan>(COLLECTION_NAME, carePlanId);
                if (existingPlan == null || existingPlan.DoctorId != request.DoctorId)
                {
                    return NotFound("Care plan not found or unauthorized");
                }

                // Update the care plan status
                existingPlan.Status = "approved";
                existingPlan.UpdatedAt = DateTime.UtcNow;

                // Save updated plan to Firebase using generic UpdateDocument method
                await _firebaseService.UpdateDocument(COLLECTION_NAME, carePlanId, existingPlan);

                return Ok(new { message = "Care plan approved successfully", carePlan = existingPlan });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error approving care plan");
                return StatusCode(500, $"Error approving care plan: {ex.Message}");
            }
        }

        [HttpGet("doctor/patient/{patientId}")]
        public async Task<IActionResult> GetPatientCarePlans(int patientId, [FromQuery] int doctorId)
        {
            try
            {
                // Use QueryCollection with a predicate to filter by both patientId and doctorId
                Expression<Func<CarePlan, bool>> predicate = plan => 
                    plan.PatientId == patientId && plan.DoctorId == doctorId;
                
                var carePlans = await _firebaseService.QueryCollection(COLLECTION_NAME, predicate);
                return Ok(carePlans);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving care plans");
                return StatusCode(500, $"Error retrieving care plans: {ex.Message}");
            }
        }
    }
}   