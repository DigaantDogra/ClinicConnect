<<<<<<< HEAD
// using System;
// using System.Collections.Generic;
// using System.Linq;
// using System.Threading.Tasks;
// using ClinicConnectService.Model;
// using Microsoft.AspNetCore.Mvc;
// using Microsoft.Extensions.Logging;
=======
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ClinicConnectService.Model;
using ClinicConnectService.Service;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
>>>>>>> main

// namespace ClinicConnectService.Controllers;

<<<<<<< HEAD
// [ApiController]
// [Route("patient")]
// public class PatientApiController : ControllerBase
// {
//     private readonly ILogger<PatientApiController> _logger;

//     public PatientApiController(ILogger<PatientApiController> logger)
//     {
//         _logger = logger;
//     }

//     [HttpGet("appointments")]
//     public IActionResult GetPatientAppointments()
//     {
//         try
//         {
//             var patientEmail = "patient@example.com"; // This should come from authentication
//             var appointments = DataStorage.Appointments
//                 .Where(a => a.PatientEmail == patientEmail)
//                 .ToList();
            
//             _logger.LogInformation("Retrieved {Count} appointments for patient {Email}", 
//                 appointments.Count, patientEmail);
            
//             return Ok(appointments);
//         }
//         catch (Exception ex)
//         {
//             _logger.LogError(ex, "Error retrieving patient appointments");
//             return StatusCode(500, "An error occurred while retrieving appointments");
//         }
//     }

//     [HttpPost("appointments")]
//     public IActionResult BookAppointment([FromBody] Appointment appointment)
//     {
//         try
//         {
//             _logger.LogInformation("Received appointment booking request: {@Appointment}", appointment);
            
//             if (!ModelState.IsValid)
//             {
//                 _logger.LogWarning("Invalid appointment data: {@ModelState}", ModelState);
//                 return BadRequest(ModelState);
//             }

//             // Check if the doctor is available at the requested time
//             var isAvailable = DataStorage.Availabilities.Any(a => 
//                 a.DoctorEmail == appointment.DoctorEmail &&
//                 a.StartTime <= appointment.StartTime &&
//                 a.EndTime >= appointment.EndTime);

//             if (!isAvailable)
//             {
//                 _logger.LogWarning("Doctor {Email} is not available at the requested time", 
//                     appointment.DoctorEmail);
//                 return BadRequest("Doctor is not available at the requested time");
//             }

//             // Check if there's already an appointment at that time
//             var hasConflict = DataStorage.Appointments.Any(a =>
//                 a.DoctorEmail == appointment.DoctorEmail &&
//                 ((a.StartTime <= appointment.StartTime && a.EndTime > appointment.StartTime) ||
//                  (a.StartTime < appointment.EndTime && a.EndTime >= appointment.EndTime)));

//             if (hasConflict)
//             {
//                 _logger.LogWarning("Time slot conflict for doctor {Email}", appointment.DoctorEmail);
//                 return BadRequest("Time slot is already booked");
//             }

//             DataStorage.Appointments.Add(appointment);
//             _logger.LogInformation("Appointment booked successfully. Total appointments: {Count}", 
//                 DataStorage.Appointments.Count);
            
//             return CreatedAtAction(nameof(GetPatientAppointments), appointment);
//         }
//         catch (Exception ex)
//         {
//             _logger.LogError(ex, "Error booking appointment");
//             return StatusCode(500, "An error occurred while booking the appointment");
//         }
//     }

//     [HttpDelete("appointments/{id}")]
//     public IActionResult CancelAppointment(string id)
//     {
//         try
//         {
//             _logger.LogInformation("Received appointment cancellation request for ID: {Id}", id);
            
//             if (string.IsNullOrEmpty(id))
//             {
//                 _logger.LogWarning("No appointment ID provided in cancel request");
//                 return BadRequest("Appointment ID is required");
//             }

//             var appointment = DataStorage.Appointments.FirstOrDefault(a => a.Id == id);
//             if (appointment == null)
//             {
//                 _logger.LogWarning("Appointment with ID {Id} not found", id);
//                 return NotFound($"Appointment with ID {id} not found");
//             }

//             DataStorage.Appointments.Remove(appointment);
//             _logger.LogInformation("Appointment with ID {Id} cancelled successfully", id);
            
//             return Ok(new { message = "Appointment cancelled successfully" });
//         }
//         catch (Exception ex)
//         {
//             _logger.LogError(ex, "Error cancelling appointment");
//             return StatusCode(500, "An error occurred while cancelling the appointment");
//         }
//     }
// }

// public class DeleteAppointmentRequest
// {
//     public string Id { get; set; }
// }
=======
[ApiController]
[Route("patient")]
public class PatientApiController : ControllerBase
{
    private readonly ILogger<PatientApiController> _logger;
    private readonly IFirebaseService _firebaseService;

    public PatientApiController(
        ILogger<PatientApiController> logger,
        IFirebaseService firebaseService)
    {
        _logger = logger;
        _firebaseService = firebaseService;
    }

    [HttpGet("{patientId}")]
    public async Task<ActionResult<string>> GetPatientName(string patientId)
    {
        try
        {
            _logger.LogInformation($"Fetching patient name for ID: {patientId}");
            
            var patient = await _firebaseService.GetDocument<Patient>("patients", patientId);
            if (patient == null)
            {
                _logger.LogWarning($"Patient not found: {patientId}");
                return NotFound($"Patient with ID {patientId} not found");
            }

            _logger.LogInformation($"Found patient name: {patient.UserName}");
            return Ok(patient.UserName);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error retrieving patient name for ID: {patientId}");
            return StatusCode(500, "An error occurred while retrieving patient name");
        }
    }

    [HttpGet("appointments/{patientId}")]
    public async Task<ActionResult<IEnumerable<Appointment>>> GetPatientAppointments(string patientId)
    {
        try
        {
            _logger.LogInformation($"Fetching appointments for patient: {patientId}");
            
            // Get patient to verify existence
            var patient = await _firebaseService.GetDocument<Patient>("patients", patientId);
            if (patient == null)
            {
                _logger.LogWarning($"Patient not found: {patientId}");
                return NotFound($"Patient with ID {patientId} not found");
            }

            // Get all appointments for this patient
            var appointments = await _firebaseService.QueryCollection<Appointment>("appointments", "PatientId", patientId);
            
            _logger.LogInformation($"Found {appointments.Count} appointments for patient: {patientId}");
            return Ok(appointments);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error retrieving appointments for patient: {patientId}");
            return StatusCode(500, "An error occurred while retrieving appointments");
        }
    }

    [HttpPost("appointments")]
    public async Task<ActionResult<Appointment>> BookAppointment([FromBody] Appointment appointment)
    {
        try
        {
            _logger.LogInformation($"Received appointment booking request: {appointment}");

            if (!ModelState.IsValid)
            {
                _logger.LogWarning($"Invalid appointment data: {ModelState}");
                return BadRequest(ModelState);
            }

            // Verify patient exists
            var patient = await _firebaseService.GetDocument<Patient>("patients", appointment.PatientId);
            if (patient == null)
            {
                _logger.LogWarning($"Patient not found: {appointment.PatientId}");
                return BadRequest($"Patient with ID {appointment.PatientId} not found");
            }

            // Verify doctor exists
            var doctor = await _firebaseService.GetDocument<Doctor>("doctors", appointment.DoctorId);
            if (doctor == null)
            {
                _logger.LogWarning($"Doctor not found: {appointment.DoctorId}");
                return BadRequest($"Doctor with ID {appointment.DoctorId} not found");
            }

            // Check if the doctor is available at the requested time
            var availability = await _firebaseService.QueryCollection<Availability>("availabilities", "DoctorId", appointment.DoctorId);
            var availableSlot = availability.FirstOrDefault(a => 
                a.Date == appointment.Date && 
                a.TimeSlot == appointment.TimeSlot && 
                a.IsAvailable);

            if (availableSlot == null)
            {
                _logger.LogWarning($"Doctor {appointment.DoctorId} is not available at the requested time");
                return BadRequest("Doctor is not available at the requested time");
            }

            // Check for conflicting appointments
            var existingAppointments = await _firebaseService.QueryCollection<Appointment>("appointments", "DoctorId", appointment.DoctorId);
            var conflictingAppointment = existingAppointments.FirstOrDefault(a => 
                a.Date == appointment.Date && 
                a.TimeSlot == appointment.TimeSlot);

            if (conflictingAppointment != null)
            {
                _logger.LogWarning($"Time slot conflict for doctor {appointment.DoctorId}");
                return BadRequest("Time slot is already booked");
            }

            // Generate a new ID for the appointment
            appointment.Id = Guid.NewGuid().ToString();
            appointment.IsConfirmed = false;

            // Add the appointment
            await _firebaseService.AddDocument("appointments", appointment.Id, appointment);

            // Update patient's appointment list
            patient.AppointmentIds.Add(appointment.Id);
            await _firebaseService.UpdateDocument("patients", patient.Id, patient);

            // Update doctor's appointment list
            doctor.AppointmentIds.Add(appointment.Id);
            await _firebaseService.UpdateDocument("doctors", doctor.Id, doctor);

            _logger.LogInformation($"Appointment booked successfully. ID: {appointment.Id}");
            return CreatedAtAction(nameof(GetPatientAppointments), new { patientId = appointment.PatientId }, appointment);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error booking appointment");
            return StatusCode(500, "An error occurred while booking the appointment");
        }
    }

    [HttpDelete("appointments/{appointmentId}")]
    public async Task<IActionResult> CancelAppointment(string appointmentId)
    {
        try
        {
            _logger.LogInformation($"Received appointment cancellation request for ID: {appointmentId}");

            // Get the appointment
            var appointment = await _firebaseService.GetDocument<Appointment>("appointments", appointmentId);
            if (appointment == null)
            {
                _logger.LogWarning($"Appointment not found: {appointmentId}");
                return NotFound($"Appointment with ID {appointmentId} not found");
            }

            // Get the patient
            var patient = await _firebaseService.GetDocument<Patient>("patients", appointment.PatientId);
            if (patient != null)
            {
                patient.AppointmentIds.Remove(appointmentId);
                await _firebaseService.UpdateDocument("patients", patient.Id, patient);
            }

            // Get the doctor
            var doctor = await _firebaseService.GetDocument<Doctor>("doctors", appointment.DoctorId);
            if (doctor != null)
            {
                doctor.AppointmentIds.Remove(appointmentId);
                await _firebaseService.UpdateDocument("doctors", doctor.Id, doctor);
            }

            // Delete the appointment
            await _firebaseService.DeleteDocument("appointments", appointmentId);

            _logger.LogInformation($"Appointment cancelled successfully. ID: {appointmentId}");
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error cancelling appointment: {appointmentId}");
            return StatusCode(500, "An error occurred while cancelling the appointment");
        }
    }
}

>>>>>>> main

// /*
// // Temporarily commented out for testing care plan functionality
// using Microsoft.AspNetCore.Mvc;

// namespace ClinicConnectService.Controllers
// {
//     // ... existing code ...
// }
// */ 