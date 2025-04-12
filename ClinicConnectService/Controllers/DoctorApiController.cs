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
            _logger.LogInformation("Received availability creation request for date {Date} at {TimeSlot}", 
                availability.Date, availability.TimeSlot);
            
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid availability data: {@ModelState}", ModelState);
                return BadRequest(ModelState);
            }

            availability.Id = Guid.NewGuid().ToString();
            availability.DoctorEmail = "doctor@example.com"; // This should come from authentication
            availability.IsAvailable = true;
            DataStorage.Availabilities.Add(availability);

            _logger.LogInformation("Added availability slot successfully for date {Date} at {TimeSlot}", 
                availability.Date, availability.TimeSlot);
            
            return Ok(new { 
                message = "Availability added successfully",
                availability = availability
            });
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
} 