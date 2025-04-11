using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ClinicConnectService.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace ClinicConnectService.Controllers;

[ApiController]
[Route("doctor")]
public class DoctorApiController : ControllerBase
{
    private readonly ILogger<DoctorApiController> _logger;

    public DoctorApiController(ILogger<DoctorApiController> logger)
    {
        _logger = logger;
    }

    [HttpGet("appointments")]
    public IActionResult GetDoctorAppointments()
    {
        try
        {
            var doctorEmail = "doctor@example.com"; // This should come from authentication
            var appointments = DataStorage.Appointments
                .Where(a => a.DoctorEmail == doctorEmail)
                .ToList();
            
            _logger.LogInformation("Retrieved {Count} appointments for doctor {Email}", 
                appointments.Count, doctorEmail);
            
            return Ok(appointments);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving doctor appointments");
            return StatusCode(500, "An error occurred while retrieving appointments");
        }
    }

    [HttpPost("availability")]
    public IActionResult AddAvailability([FromBody] Availability availability)
    {
        try
        {
            _logger.LogInformation("Received availability creation request: {@Availability}", availability);
            
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid availability data: {@ModelState}", ModelState);
                return BadRequest(ModelState);
            }

            DataStorage.Availabilities.Add(availability);
            _logger.LogInformation("Availability added successfully. Total availabilities: {Count}", 
                DataStorage.Availabilities.Count);
            
            return CreatedAtAction(nameof(GetAvailabilities), availability);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating availability");
            return StatusCode(500, "An error occurred while creating availability");
        }
    }

    [HttpGet("availability")]
    public IActionResult GetAvailabilities()
    {
        try
        {
            var doctorEmail = "doctor@example.com"; // This should come from authentication
            var availabilities = DataStorage.Availabilities
                .Where(a => a.DoctorEmail == doctorEmail)
                .ToList();
            
            _logger.LogInformation("Retrieved {Count} availabilities for doctor {Email}", 
                availabilities.Count, doctorEmail);
            
            return Ok(availabilities);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving availabilities");
            return StatusCode(500, "An error occurred while retrieving availabilities");
        }
    }

    [HttpDelete("availability")]
    public IActionResult DeleteAvailability([FromBody] DeleteAvailabilityRequest request)
    {
        try
        {
            _logger.LogInformation("Received availability deletion request for ID: {Id}", request.Id);
            
            if (string.IsNullOrEmpty(request.Id))
            {
                _logger.LogWarning("No availability ID provided in delete request");
                return BadRequest("Availability ID is required");
            }

            var availability = DataStorage.Availabilities.FirstOrDefault(a => a.Id == request.Id);
            if (availability == null)
            {
                _logger.LogWarning("Availability with ID {Id} not found", request.Id);
                return NotFound($"Availability with ID {request.Id} not found");
            }

            DataStorage.Availabilities.Remove(availability);
            _logger.LogInformation("Availability with ID {Id} deleted successfully", request.Id);
            
            return Ok(new { message = "Availability deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting availability");
            return StatusCode(500, "An error occurred while deleting the availability");
        }
    }
}

public class DeleteAvailabilityRequest
{
    public string Id { get; set; }
} 