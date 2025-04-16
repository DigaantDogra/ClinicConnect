using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ClinicConnectService.Model;
using ClinicConnectService.Service;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace ClinicConnectService.Controllers;

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

<<<<<<< HEAD
    [HttpGet("appointments/{patientEmail}")]
    public ActionResult<List<Appointment>> GetAppointments(string patientEmail)
    {
        try
        {
            _logger.LogInformation("Getting appointments for patient: {PatientEmail}", patientEmail);
            var appointments = DataStorage.Appointments
                .Where(a => a.PatientEmail == patientEmail)
                .ToList();
            
            _logger.LogInformation("Found {Count} appointments for patient: {PatientEmail}", 
                appointments.Count, patientEmail);
=======
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
>>>>>>> Firebase-Integration
            
            _logger.LogInformation($"Found {appointments.Count} appointments for patient: {patientId}");
            return Ok(appointments);
        }
        catch (Exception ex)
        {
<<<<<<< HEAD
            _logger.LogError(ex, "Error getting appointments for patient: {PatientEmail}", patientEmail);
=======
            _logger.LogError(ex, $"Error retrieving appointments for patient: {patientId}");
>>>>>>> Firebase-Integration
            return StatusCode(500, "An error occurred while retrieving appointments");
        }
    }

    [HttpPost("appointments")]
<<<<<<< HEAD
    public ActionResult<Appointment> BookAppointment([FromBody] Appointment appointment)
    {
        try
        {
            _logger.LogInformation("Booking appointment for patient: {PatientEmail}", appointment.PatientEmail);

            // Check if the time slot is available
            var isAvailable = DataStorage.Availabilities.Any(a => 
                a.DoctorEmail == appointment.DoctorEmail &&
                a.Date == appointment.Date &&
                a.TimeSlot == appointment.TimeSlot &&
                a.IsAvailable);

            if (!isAvailable)
            {
                _logger.LogWarning("Time slot not available for doctor: {DoctorEmail} on {Date} at {TimeSlot}", 
                    appointment.DoctorEmail, appointment.Date, appointment.TimeSlot);
                return BadRequest("The selected time slot is not available");
            }

            // Add the appointment
            DataStorage.Appointments.Add(appointment);

            // Mark the time slot as unavailable
            var availability = DataStorage.Availabilities.FirstOrDefault(a => 
                a.DoctorEmail == appointment.DoctorEmail &&
                a.Date == appointment.Date &&
                a.TimeSlot == appointment.TimeSlot);
            
            if (availability != null)
            {
                availability.IsAvailable = false;
            }

            _logger.LogInformation("Successfully booked appointment for patient: {PatientEmail}", 
                appointment.PatientEmail);
            
            return Ok(appointment);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error booking appointment for patient: {PatientEmail}", 
                appointment.PatientEmail);
=======
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
>>>>>>> Firebase-Integration
            return StatusCode(500, "An error occurred while booking the appointment");
        }
    }

<<<<<<< HEAD
    [HttpDelete("appointments/{id}")]
    public ActionResult CancelAppointment(string id)
    {
        try
        {
            _logger.LogInformation("Canceling appointment with ID: {Id}", id);
            
            var appointment = DataStorage.Appointments.FirstOrDefault(a => a.Id == id);
            if (appointment == null)
            {
                _logger.LogWarning("Appointment not found with ID: {Id}", id);
                return NotFound("Appointment not found");
            }

            // Mark the time slot as available again
            var availability = DataStorage.Availabilities.FirstOrDefault(a => 
                a.DoctorEmail == appointment.DoctorEmail &&
                a.Date == appointment.Date &&
                a.TimeSlot == appointment.TimeSlot);
            
            if (availability != null)
            {
                availability.IsAvailable = true;
            }

            // Remove the appointment
            DataStorage.Appointments.Remove(appointment);

            _logger.LogInformation("Successfully canceled appointment with ID: {Id}", id);
            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error canceling appointment with ID: {Id}", id);
            return StatusCode(500, "An error occurred while canceling the appointment");
=======
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
>>>>>>> Firebase-Integration
        }
    }
}


/*
// Temporarily commented out for testing care plan functionality
using Microsoft.AspNetCore.Mvc;

namespace ClinicConnectService.Controllers
{
    // ... existing code ...
}
*/ 