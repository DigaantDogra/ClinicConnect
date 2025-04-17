// Controllers/CarePlanController.cs
using Microsoft.AspNetCore.Mvc;
using ClinicConnectService.Services;
using ClinicConnectService.Model;
using System.Threading.Tasks;
using System;
using System.Linq.Expressions;
using System.Linq;
using Google.Cloud.Firestore;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;

namespace ClinicConnectService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CarePlanController : ControllerBase
    {
        private readonly ILogger<CarePlanController> _logger;
        private readonly IFirebaseService _firebaseService;
        private readonly ICarePlanService _carePlanService;
        private const string COLLECTION_NAME = "careplans";
        private const string PATIENTS_COLLECTION = "patients";
        private const string DOCTORS_COLLECTION = "doctors";

        public CarePlanController(
            ILogger<CarePlanController> logger,
            IFirebaseService firebaseService,
            ICarePlanService carePlanService)
        {
            _logger = logger;
            _firebaseService = firebaseService;
            _carePlanService = carePlanService;
        }

        [HttpPost("generate")]
        public async Task<IActionResult> GenerateCarePlan([FromBody] CarePlanRequest request)
        {
            try
            {
                _logger.LogInformation("Received care plan generation request: {@Request}", request);

                // Verify patient exists
                var patient = await _firebaseService.GetDocument<Patient>(PATIENTS_COLLECTION, request.PatientId);
                if (patient == null)
                {
                    _logger.LogWarning("Patient not found: {PatientId}", request.PatientId);
                    return NotFound($"Patient with ID {request.PatientId} not found");
                }
                _logger.LogInformation("Found patient: {@Patient}", patient);

                // Verify doctor exists
                var doctor = await _firebaseService.GetDocument<Doctor>(DOCTORS_COLLECTION, request.DoctorId);
                if (doctor == null)
                {
                    _logger.LogWarning("Doctor not found: {DoctorId}", request.DoctorId);
                    return NotFound($"Doctor with ID {request.DoctorId} not found");
                }
                _logger.LogInformation("Found doctor: {@Doctor}", doctor);

                // Get patient's medical history from Firebase
                var medicalHistory = await _firebaseService.GetDocument<MedicalHistory>("medicalHistory", request.PatientId);
                _logger.LogInformation("Found medical history: {@MedicalHistory}", medicalHistory);
                
                // Build the structured prompt for the AI model
                var prompt = new StructuredPrompt
                {
                    Profile = $"{patient.Age}yo {patient.Gender}, {request.Condition}",
                    Condition = request.Condition.ToLower().Split(new[] { ' ', ',' }, StringSplitOptions.RemoveEmptyEntries)[0],
                    Subtype = request.Condition.ToLower().Contains("type 2") ? "Type 2" : 
                              request.Condition.ToLower().Contains("type 1") ? "Type 1" : "Not specified",
                    Comorbidities = medicalHistory?.Comorbidities ?? new List<string>()
                };

                _logger.LogInformation("Generated prompt for FastAPI: {@Prompt}", prompt);

                // Generate care plan using the AI service
                var generatedPlan = await _carePlanService.GenerateCarePlanAsync(prompt);
                _logger.LogInformation("Generated care plan: {GeneratedPlan}", generatedPlan);

                // Create care plan document
                var carePlan = new CarePlan
                {
                    Id = Guid.NewGuid().ToString(),
                    PatientId = request.PatientId,
                    DoctorId = request.DoctorId,
                    GeneratedCarePlan = generatedPlan,
                    Status = "draft",
                    Condition = request.Condition,
                    Notes = request.ClinicalGuidance,
                    DateCreated = DateTime.UtcNow.ToString("o"),
                    ApprovedCarePlan = "",
                    OriginalPrompt = prompt.Profile
                };

                _logger.LogInformation("Created care plan: {@CarePlan}", carePlan);

                // Save to Firebase
                await _firebaseService.AddDocument(COLLECTION_NAME, carePlan.Id, carePlan);
                _logger.LogInformation("Saved care plan to Firebase");

                // Add care plan reference to patient's care plans
                var patientCarePlans = await _firebaseService.GetDocument<Dictionary<string, object>>(PATIENTS_COLLECTION, $"{request.PatientId}/carePlans") ?? new Dictionary<string, object>();
                patientCarePlans[carePlan.Id] = new { id = carePlan.Id, dateCreated = carePlan.DateCreated };
                await _firebaseService.UpdateDocument(PATIENTS_COLLECTION, request.PatientId, new { carePlans = patientCarePlans });

                // Add care plan reference to doctor's care plans
                var doctorCarePlans = await _firebaseService.GetDocument<Dictionary<string, object>>(DOCTORS_COLLECTION, $"{request.DoctorId}/carePlans") ?? new Dictionary<string, object>();
                doctorCarePlans[carePlan.Id] = new { id = carePlan.Id, dateCreated = carePlan.DateCreated };
                await _firebaseService.UpdateDocument(DOCTORS_COLLECTION, request.DoctorId, new { carePlans = doctorCarePlans });

                return Ok(new { carePlan });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating care plan. Stack trace: {StackTrace}", ex.StackTrace);
                return StatusCode(500, $"An error occurred while generating the care plan: {ex.Message}");
            }
        }

        [HttpPut("edit")]
        public async Task<IActionResult> EditCarePlan([FromBody] EditCarePlanRequest request)
        {
            try
            {
                // Get the care plan
                var carePlan = await _firebaseService.GetDocument<CarePlan>(COLLECTION_NAME, request.CarePlanId);
                if (carePlan == null)
                {
                    return NotFound($"Care plan with ID {request.CarePlanId} not found");
                }

                // Verify doctor is authorized
                if (carePlan.DoctorId != request.DoctorId)
                {
                    return Unauthorized("You are not authorized to edit this care plan");
                }

                // Update the plan
                carePlan.GeneratedCarePlan = request.Plan;
                carePlan.DateCreated = DateTime.UtcNow.ToString("o");

                // Save to Firebase
                await _firebaseService.UpdateDocument(COLLECTION_NAME, carePlan.Id, carePlan);

                return Ok(carePlan);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error editing care plan");
                return StatusCode(500, "An error occurred while editing the care plan");
            }
        }

        [HttpPut("approve")]
        public async Task<IActionResult> ApproveCarePlan([FromBody] ApproveCarePlanRequest request)
        {
            try
            {
                // Get the care plan
                var carePlan = await _firebaseService.GetDocument<CarePlan>(COLLECTION_NAME, request.CarePlanId);
                if (carePlan == null)
                {
                    return NotFound($"Care plan with ID {request.CarePlanId} not found");
                }

                // Verify doctor is authorized
                if (carePlan.DoctorId != request.DoctorId)
                {
                    return Unauthorized("You are not authorized to approve this care plan");
                }

                // Update the plan status
                carePlan.Status = "approved";
                carePlan.Notes = request.Notes;
                carePlan.DateCreated = DateTime.UtcNow.ToString("o");

                // Save to Firebase
                await _firebaseService.UpdateDocument(COLLECTION_NAME, carePlan.Id, carePlan);

                return Ok(carePlan);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error approving care plan");
                return StatusCode(500, "An error occurred while approving the care plan");
            }
        }

        [HttpGet("doctor/{doctorId}/patient/{patientId}")]
        public async Task<IActionResult> GetPatientCarePlans(string doctorId, string patientId)
        {
            try
            {
                // Verify doctor exists
                var doctor = await _firebaseService.GetDocument<Doctor>(DOCTORS_COLLECTION, doctorId);
                if (doctor == null)
                {
                    return NotFound($"Doctor with ID {doctorId} not found");
                }

                // Get all care plans for this patient
                var carePlans = await _firebaseService.QueryCollection<CarePlan>(COLLECTION_NAME, "PatientId", patientId);

                // Filter by doctor if needed
                var filteredPlans = carePlans.Where(p => p.DoctorId == doctorId).ToList();

                return Ok(filteredPlans);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving care plans");
                return StatusCode(500, "An error occurred while retrieving care plans");
            }
        }
    }
}   