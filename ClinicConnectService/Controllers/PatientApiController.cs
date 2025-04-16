using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ClinicConnectService.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace ClinicConnectService.Controllers;

[ApiController]
[Route("patient")]
public class PatientApiController : ControllerBase
{
    private readonly ILogger<PatientApiController> _logger;

    public PatientApiController(ILogger<PatientApiController> logger)
    {
        _logger = logger;
    }

    [HttpGet("appointments")]
    public IActionResult GetPatientAppointments()
    {
        try
        {
            var patientEmail = "patient@example.com"; // This should come from authentication
            var appointments = DataStorage.Appointments
                .Where(a => a.PatientEmail == patientEmail)
                .ToList();
            
            _logger.LogInformation("Retrieved {Count} appointments for patient {Email}", 
                appointments.Count, patientEmail);
            
            return Ok(appointments);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving patient appointments");
            return StatusCode(500, "An error occurred while retrieving appointments");
        }
    }

    [HttpPost("appointments")]
    public IActionResult BookAppointment([FromBody] Appointment appointment)
    {
        try
        {
            _logger.LogInformation("Received appointment booking request: {@Appointment}", appointment);
            
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid appointment data: {@ModelState}", ModelState);
                return BadRequest(ModelState);
            }

            // Check if the doctor is available at the requested time
            var isAvailable = DataStorage.Availabilities.Any(a => 
                a.DoctorEmail == appointment.DoctorEmail &&
                a.StartTime <= appointment.StartTime &&
                a.EndTime >= appointment.EndTime);

            if (!isAvailable)
            {
                _logger.LogWarning("Doctor {Email} is not available at the requested time", 
                    appointment.DoctorEmail);
                return BadRequest("Doctor is not available at the requested time");
            }

            // Check if there's already an appointment at that time
            var hasConflict = DataStorage.Appointments.Any(a =>
                a.DoctorEmail == appointment.DoctorEmail &&
                ((a.StartTime <= appointment.StartTime && a.EndTime > appointment.StartTime) ||
                 (a.StartTime < appointment.EndTime && a.EndTime >= appointment.EndTime)));

            if (hasConflict)
            {
                _logger.LogWarning("Time slot conflict for doctor {Email}", appointment.DoctorEmail);
                return BadRequest("Time slot is already booked");
            }

            DataStorage.Appointments.Add(appointment);
            _logger.LogInformation("Appointment booked successfully. Total appointments: {Count}", 
                DataStorage.Appointments.Count);
            
            return CreatedAtAction(nameof(GetPatientAppointments), appointment);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error booking appointment");
            return StatusCode(500, "An error occurred while booking the appointment");
        }
    }

    [HttpDelete("appointments/{id}")]
    public IActionResult CancelAppointment(string id)
    {
        try
        {
            _logger.LogInformation("Received appointment cancellation request for ID: {Id}", id);
            
            if (string.IsNullOrEmpty(id))
            {
                _logger.LogWarning("No appointment ID provided in cancel request");
                return BadRequest("Appointment ID is required");
            }

            var appointment = DataStorage.Appointments.FirstOrDefault(a => a.Id == id);
            if (appointment == null)
            {
                _logger.LogWarning("Appointment with ID {Id} not found", id);
                return NotFound($"Appointment with ID {id} not found");
            }

            DataStorage.Appointments.Remove(appointment);
            _logger.LogInformation("Appointment with ID {Id} cancelled successfully", id);
            
            return Ok(new { message = "Appointment cancelled successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error cancelling appointment");
            return StatusCode(500, "An error occurred while cancelling the appointment");
        }
    }
}

public class DeleteAppointmentRequest
{
    public string Id { get; set; }
}

/*
// Temporarily commented out for testing care plan functionality
using Microsoft.AspNetCore.Mvc;

namespace ClinicConnectService.Controllers
{
    // ... existing code ...
}
*/ 