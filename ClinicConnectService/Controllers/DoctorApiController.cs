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
[Route("doctor")]
public class DoctorApiController : ControllerBase
{
    private readonly ILogger<DoctorApiController> _logger;
    private readonly IFirebaseService _firebaseService;

    public DoctorApiController(
        ILogger<DoctorApiController> logger,
        IFirebaseService firebaseService)
    {
        _logger = logger;
        _firebaseService = firebaseService;
    }

    [HttpGet("name/{doctorEmail}")]
    public async Task<ActionResult<string>> GetDoctorName(string doctorEmail)
    {
        try
        {
            _logger.LogInformation($"Fetching doctor name for email: {doctorEmail}");
            
            var doctor = await _firebaseService.GetDocument<Doctor>("doctors", doctorEmail);
            if (doctor == null)
            {
                _logger.LogWarning($"Doctor not found: {doctorEmail}");
                return NotFound($"Doctor with email {doctorEmail} not found");
            }

            _logger.LogInformation($"Found doctor name: {doctor.UserName}");
            return Ok(doctor.UserName);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error retrieving doctor name for email: {doctorEmail}");
            return StatusCode(500, "An error occurred while retrieving doctor name");
        }
    }

    [HttpGet("appointments/{doctorEmail}")]
    public async Task<ActionResult<IEnumerable<Appointment>>> GetDoctorAppointments(string doctorEmail)
    {
        try
        {
            _logger.LogInformation($"Fetching appointments for doctor: {doctorEmail}");
            
            // Get doctor to verify existence
            var doctor = await _firebaseService.GetDocument<Doctor>("doctors", doctorEmail);
            if (doctor == null)
            {
                _logger.LogWarning($"Doctor not found: {doctorEmail}");
                return NotFound($"Doctor with email {doctorEmail} not found");
            }

            // Get all appointments for this doctor
            var appointments = await _firebaseService.QueryCollection<Appointment>("appointments", "DoctorEmail", doctorEmail);
            
            _logger.LogInformation($"Found {appointments.Count} appointments for doctor: {doctorEmail}");
            return Ok(appointments);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error retrieving appointments for doctor: {doctorEmail}");
            return StatusCode(500, "An error occurred while retrieving appointments");
        }
    }

    [HttpPost("availability")]
    public async Task<ActionResult<Availability>> AddAvailability([FromBody] Availability availability)
    {
        try
        {
            _logger.LogInformation($"Received availability creation request: {availability}");

            if (!ModelState.IsValid)
            {
                _logger.LogWarning($"Invalid availability data: {ModelState}");
                return BadRequest(ModelState);
            }

            // Verify doctor exists
            var doctor = await _firebaseService.GetDocument<Doctor>("doctors", availability.DoctorEmail);
            if (doctor == null)
            {
                _logger.LogWarning($"Doctor not found: {availability.DoctorEmail}");
                return BadRequest($"Doctor with email {availability.DoctorEmail} not found");
            }

            // Check for existing availability at the same time
            var existingAvailability = await _firebaseService.QueryCollection<Availability>("availabilities", "DoctorEmail", availability.DoctorEmail);
            var conflictingSlot = existingAvailability.FirstOrDefault(a => 
                a.Date == availability.Date && 
                a.TimeSlot == availability.TimeSlot);

            if (conflictingSlot != null)
            {
                _logger.LogWarning($"Availability already exists for doctor {availability.DoctorEmail} at {availability.Date} {availability.TimeSlot}");
                return BadRequest("Availability slot already exists");
            }

            // Generate a new ID for the availability
            availability.Id = Guid.NewGuid().ToString();
            availability.IsAvailable = true;

            // Add the availability
            await _firebaseService.AddDocument("availabilities", availability.Id, availability);

            // Update doctor's availability list
            doctor.AvailabilityIds.Add(availability.Id);
            await _firebaseService.UpdateDocument("doctors", doctor.Id, doctor);

            _logger.LogInformation($"Availability added successfully. ID: {availability.Id}");
            return CreatedAtAction(nameof(GetAvailabilities), new { doctorEmail = availability.DoctorEmail }, availability);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating availability");
            return StatusCode(500, "An error occurred while creating availability");
        }
    }

    [HttpGet("availability/{doctorEmail}")]
    public async Task<ActionResult<IEnumerable<Availability>>> GetAvailabilities(string doctorEmail)
    {
        try
        {
            _logger.LogInformation($"Fetching availabilities for doctor: {doctorEmail}");

            // Get doctor to verify existence
            var doctor = await _firebaseService.GetDocument<Doctor>("doctors", doctorEmail);
            if (doctor == null)
            {
                _logger.LogWarning($"Doctor not found: {doctorEmail}");
                return NotFound($"Doctor with email {doctorEmail} not found");
            }

            // Get all availabilities for this doctor
            var availabilities = await _firebaseService.QueryCollection<Availability>("availabilities", "DoctorEmail", doctorEmail);
            
            _logger.LogInformation($"Found {availabilities.Count} availabilities for doctor: {doctorEmail}");
            return Ok(availabilities);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error retrieving availabilities for doctor: {doctorEmail}");
            return StatusCode(500, "An error occurred while retrieving availabilities");
        }
    }

    [HttpDelete("availability/{availabilityId}")]
    public async Task<IActionResult> DeleteAvailability(string availabilityId)
    {
        try
        {
            _logger.LogInformation($"Received availability deletion request for ID: {availabilityId}");

            // Get the availability
            var availability = await _firebaseService.GetDocument<Availability>("availabilities", availabilityId);
            if (availability == null)
            {
                _logger.LogWarning($"Availability not found: {availabilityId}");
                return NotFound($"Availability with ID {availabilityId} not found");
            }

            // Get the doctor
            var doctor = await _firebaseService.GetDocument<Doctor>("doctors", availability.DoctorEmail);
            if (doctor != null)
            {
                doctor.AvailabilityIds.Remove(availabilityId);
                await _firebaseService.UpdateDocument("doctors", doctor.Id, doctor);
            }

            // Delete the availability
            await _firebaseService.DeleteDocument("availabilities", availabilityId);

            _logger.LogInformation($"Availability deleted successfully. ID: {availabilityId}");
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error deleting availability: {availabilityId}");
            return StatusCode(500, "An error occurred while deleting availability");
        }
    }
} 