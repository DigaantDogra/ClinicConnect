using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ClinicConnectService.Model;
using ClinicConnectService.Service;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Linq;

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
    public async Task<IActionResult> BookAppointment([FromBody] Appointment appointment)
    {
        try
        {
            _logger.LogInformation($"Booking appointment for patient {appointment.PatientId} with doctor {appointment.DoctorId}");
            
            // Check if the time slot is available
            var availability = await _firebaseService.QueryCollection<Availability>("availabilities", "DoctorId", appointment.DoctorId);
            var availableSlot = availability.FirstOrDefault(a => 
                a.Dates.Contains(appointment.Date) && 
                a.TimeSlots.Contains(appointment.TimeSlot) && 
                a.IsAvailable);

            if (availableSlot == null)
            {
                _logger.LogWarning($"Time slot not available: {appointment.Date} {appointment.TimeSlot}");
                return BadRequest("Selected time slot is not available");
            }

            // Check for conflicting appointments
            var existingAppointments = await _firebaseService.QueryCollection<Appointment>("appointments", "DoctorId", appointment.DoctorId);
            var conflictingAppointment = existingAppointments.FirstOrDefault(a => 
                a.Date == appointment.Date && 
                a.TimeSlot == appointment.TimeSlot);

            if (conflictingAppointment != null)
            {
                _logger.LogWarning($"Conflicting appointment found: {conflictingAppointment.Id}");
                return BadRequest("Time slot is already booked");
            }

            // Create the appointment
            appointment.Id = Guid.NewGuid().ToString();
            appointment.IsConfirmed = false;
            await _firebaseService.AddDocument("appointments", appointment.Id, appointment);

            _logger.LogInformation($"Appointment booked successfully. ID: {appointment.Id}");
            return CreatedAtAction(nameof(GetPatientAppointments), new { patientId = appointment.PatientId }, appointment);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error booking appointment");
            return StatusCode(500, "Error booking appointment");
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
