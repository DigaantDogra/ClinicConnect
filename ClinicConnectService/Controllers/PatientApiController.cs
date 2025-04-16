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

    [HttpGet("name/{patientEmail}")]
    public async Task<ActionResult<string>> GetPatientName(string patientEmail)
    {
        try
        {
            _logger.LogInformation($"Fetching patient name for email: {patientEmail}");
            
            var patient = await _firebaseService.GetDocument<Patient>("patients", patientEmail);
            if (patient == null)
            {
                _logger.LogWarning($"Patient not found: {patientEmail}");
                return NotFound($"Patient with email {patientEmail} not found");
            }

            _logger.LogInformation($"Found patient name: {patient.UserName}");
            return Ok(patient.UserName);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error retrieving patient name for email: {patientEmail}");
            return StatusCode(500, "An error occurred while retrieving patient name");
        }
    }

    [HttpGet("appointments/{patientEmail}")]
    public async Task<ActionResult<IEnumerable<Appointment>>> GetPatientAppointments(string patientEmail)
    {
        try
        {
            _logger.LogInformation($"Fetching appointments for patient: {patientEmail}");
            
            // Get patient to verify existence
            var patient = await _firebaseService.GetDocument<Patient>("patients", patientEmail);
            if (patient == null)
            {
                _logger.LogWarning($"Patient not found: {patientEmail}");
                return NotFound($"Patient with email {patientEmail} not found");
            }

            // Get all appointments for this patient
            var appointments = await _firebaseService.QueryCollection<Appointment>("appointments", "PatientEmail", patientEmail);
            
            _logger.LogInformation($"Found {appointments.Count} appointments for patient: {patientEmail}");
            return Ok(appointments);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error retrieving appointments for patient: {patientEmail}");
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
            var patient = await _firebaseService.GetDocument<Patient>("patients", appointment.PatientEmail);
            if (patient == null)
            {
                _logger.LogWarning($"Patient not found: {appointment.PatientEmail}");
                return BadRequest($"Patient with email {appointment.PatientEmail} not found");
            }

            // Verify doctor exists
            var doctor = await _firebaseService.GetDocument<Doctor>("doctors", appointment.DoctorEmail);
            if (doctor == null)
            {
                _logger.LogWarning($"Doctor not found: {appointment.DoctorEmail}");
                return BadRequest($"Doctor with email {appointment.DoctorEmail} not found");
            }

            // Check if the doctor is available at the requested time
            var availability = await _firebaseService.QueryCollection<Availability>("availabilities", "DoctorEmail", appointment.DoctorEmail);
            var availableSlot = availability.FirstOrDefault(a => 
                a.Date == appointment.Date && 
                a.TimeSlot == appointment.TimeSlot && 
                a.IsAvailable);

            if (availableSlot == null)
            {
                _logger.LogWarning($"Doctor {appointment.DoctorEmail} is not available at the requested time");
                return BadRequest("Doctor is not available at the requested time");
            }

            // Check for conflicting appointments
            var existingAppointments = await _firebaseService.QueryCollection<Appointment>("appointments", "DoctorEmail", appointment.DoctorEmail);
            var conflictingAppointment = existingAppointments.FirstOrDefault(a => 
                a.Date == appointment.Date && 
                a.TimeSlot == appointment.TimeSlot);

            if (conflictingAppointment != null)
            {
                _logger.LogWarning($"Time slot conflict for doctor {appointment.DoctorEmail}");
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
            return CreatedAtAction(nameof(GetPatientAppointments), new { patientEmail = appointment.PatientEmail }, appointment);
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
            var patient = await _firebaseService.GetDocument<Patient>("patients", appointment.PatientEmail);
            if (patient != null)
            {
                patient.AppointmentIds.Remove(appointmentId);
                await _firebaseService.UpdateDocument("patients", patient.Id, patient);
            }

            // Get the doctor
            var doctor = await _firebaseService.GetDocument<Doctor>("doctors", appointment.DoctorEmail);
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


/*
// Temporarily commented out for testing care plan functionality
using Microsoft.AspNetCore.Mvc;

namespace ClinicConnectService.Controllers
{
    // ... existing code ...
}
*/ 