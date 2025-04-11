using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ClinicConnectService.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace ClinicConnectService.Controllers;

public static class DataStorage
{
    public static List<Appointment> Appointments = new List<Appointment>();
    public static List<Availability> Availabilities = new List<Availability>();
    public static List<User> Users = new List<User>();
}

[ApiController]
[Route("patient")]
public class ApiController : ControllerBase
{
    private readonly ILogger<ApiController> _logger;

    public ApiController(ILogger<ApiController> logger)
    {
        _logger = logger;
    }

    [HttpPost("appointment/create")]
    public IActionResult CreateAppointment([FromBody] Appointment appointment)
    {
        try
        {
            _logger.LogInformation("Received appointment creation request: {@Appointment}", appointment);
            
            // Set patient email from authentication context
            appointment.Email = "example@example.com";
            
            // Add validation logic here
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid appointment data: {@ModelState}", ModelState);
                return BadRequest(ModelState);
            }

            DataStorage.Appointments.Add(appointment);
            _logger.LogInformation("Appointment added successfully. Total appointments: {Count}", DataStorage.Appointments.Count);
            
            return CreatedAtAction(nameof(GetAppointments), appointment);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating appointment");
            return StatusCode(500, "An error occurred while creating the appointment");
        }
    }

    [HttpGet("appointment/get")]
    public IActionResult GetAppointments()
    {
        try
        {
            var patientEmail = "example@example.com";
            var appointments = DataStorage.Appointments.Where(a => a.Email == patientEmail).ToList();
            
            _logger.LogInformation("Retrieved {Count} appointments for email {Email}", 
                appointments.Count, patientEmail);
            _logger.LogInformation("Appointments: {@Appointments}", appointments);
            
            return Ok(appointments);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving appointments");
            return StatusCode(500, "An error occurred while retrieving appointments");
        }
    }

    [HttpDelete("appointment/delete")]
    public IActionResult DeleteAppointment([FromBody] DeleteAppointmentRequest request)
    {
        try
        {
            _logger.LogInformation("Received appointment deletion request for ID: {Id}", request.Id);
            
            if (string.IsNullOrEmpty(request.Id))
            {
                _logger.LogWarning("No appointment ID provided in delete request");
                return BadRequest("Appointment ID is required");
            }

            var appointment = DataStorage.Appointments.FirstOrDefault(a => a.Id == request.Id);
            if (appointment == null)
            {
                _logger.LogWarning("Appointment with ID {Id} not found", request.Id);
                return NotFound($"Appointment with ID {request.Id} not found");
            }

            DataStorage.Appointments.Remove(appointment);
            _logger.LogInformation("Appointment with ID {Id} deleted successfully", request.Id);
            
            return Ok(new { message = "Appointment deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting appointment");
            return StatusCode(500, "An error occurred while deleting the appointment");
        }
    }

    [HttpPut("appointment/edit")]
    public IActionResult EditAppointment([FromBody] Appointment updatedAppointment)
    {
        try
        {
            _logger.LogInformation("Received appointment edit request: {@Appointment}", updatedAppointment);
            
            if (string.IsNullOrEmpty(updatedAppointment.Id))
            {
                _logger.LogWarning("No appointment ID provided in edit request");
                return BadRequest("Appointment ID is required");
            }

            var existingAppointment = DataStorage.Appointments.FirstOrDefault(a => a.Id == updatedAppointment.Id);
            if (existingAppointment == null)
            {
                _logger.LogWarning("Appointment with ID {Id} not found", updatedAppointment.Id);
                return NotFound($"Appointment with ID {updatedAppointment.Id} not found");
            }

            // Update the appointment properties
            existingAppointment.Date = updatedAppointment.Date;
            existingAppointment.Time = updatedAppointment.Time;
            existingAppointment.Reason = updatedAppointment.Reason;
            existingAppointment.Day = updatedAppointment.Day;
            existingAppointment.Email = updatedAppointment.Email;

            _logger.LogInformation("Appointment with ID {Id} updated successfully", updatedAppointment.Id);
            
            return Ok(new { message = "Appointment updated successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating appointment");
            return StatusCode(500, "An error occurred while updating the appointment");
        }
    }
}

public class DeleteAppointmentRequest
{
    public string Id { get; set; }
}
