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
            
            return Ok(appointments);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting appointments for patient: {PatientEmail}", patientEmail);
            return StatusCode(500, "An error occurred while retrieving appointments");
        }
    }

    [HttpPost("appointments")]
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
            return StatusCode(500, "An error occurred while booking the appointment");
        }
    }

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
        }
    }
}

public class DeleteAppointmentRequest
{
    public string Id { get; set; }
} 