using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ClinicConnectService.Model;
using ClinicConnectService.Services;
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

    [HttpGet("{doctorId}")]
    public async Task<ActionResult<string>> GetDoctorName(string doctorId)
    {
        try
        {
            _logger.LogInformation($"Fetching doctor name for ID: {doctorId}");
            
            var doctor = await _firebaseService.GetDocument<Doctor>("doctors", doctorId);
            if (doctor == null)
            {
                _logger.LogWarning($"Doctor not found: {doctorId}");
                return NotFound($"Doctor with ID {doctorId} not found");
            }

            _logger.LogInformation($"Found doctor name: {doctor.UserName}");
            return Ok(doctor.UserName);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error retrieving doctor name for ID: {doctorId}");
            return StatusCode(500, "An error occurred while retrieving doctor name");
        }
    }

    [HttpGet("appointments/{doctorId}")]
    public async Task<ActionResult<IEnumerable<Appointment>>> GetDoctorAppointments(string doctorId)
    {
        try
        {
            _logger.LogInformation($"Fetching appointments for doctor: {doctorId}");
            
            // Get doctor to verify existence
            var doctor = await _firebaseService.GetDocument<Doctor>("doctors", doctorId);
            if (doctor == null)
            {
                _logger.LogWarning($"Doctor not found: {doctorId}");
                return NotFound($"Doctor with ID {doctorId} not found");
            }

            // Get all appointments for this doctor
            var appointments = await _firebaseService.QueryCollection<Appointment>("appointments", "DoctorId", doctorId);
            
            _logger.LogInformation($"Found {appointments.Count} appointments for doctor: {doctorId}");
            return Ok(appointments);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error retrieving appointments for doctor: {doctorId}");
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
            var doctor = await _firebaseService.GetDocument<Doctor>("doctors", availability.DoctorId);
            if (doctor == null)
            {
                _logger.LogWarning($"Doctor not found: {availability.DoctorId}");
                return BadRequest($"Doctor with ID {availability.DoctorId} not found");
            }

            // Check for existing availability at the same time
            var existingAvailability = await _firebaseService.QueryCollection<Availability>("availabilities", "DoctorId", availability.DoctorId);
            var conflictingSlot = existingAvailability.FirstOrDefault(a => 
                a.Dates.Contains(availability.Dates[0]) && 
                a.TimeSlots.Contains(availability.TimeSlots[0]));

            if (conflictingSlot != null)
            {
                _logger.LogWarning($"Availability already exists for doctor {availability.DoctorId} at {availability.Dates[0]} {availability.TimeSlots[0]}");
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
            return CreatedAtAction(nameof(GetDoctorAvailability), new { doctorId = availability.DoctorId }, availability);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating availability");
            return StatusCode(500, "An error occurred while creating availability");
        }
    }

    [HttpGet("availability/{doctorId}")]
    public async Task<IActionResult> GetDoctorAvailability(string doctorId)
    {
        try
        {
            _logger.LogInformation($"Fetching availability for doctor {doctorId}");
            var availabilities = await _firebaseService.QueryCollection<Availability>("availabilities", "DoctorId", doctorId);
            return Ok(availabilities);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error fetching availability for doctor {doctorId}");
            return StatusCode(500, "Error fetching availability");
        }
    }

    [HttpDelete("availability/{availabilityId}")]
    public async Task<IActionResult> DeleteAvailability(string availabilityId)
    {
        try
        {
            _logger.LogInformation($"Received availability deletion request for ID: {availabilityId}");

            // Get the availability to find the doctor ID
            var availability = await _firebaseService.GetDocument<Availability>("availabilities", availabilityId);
            if (availability == null)
            {
                _logger.LogWarning($"Availability not found: {availabilityId}");
                return NotFound($"Availability with ID {availabilityId} not found");
            }

            // Get the doctor to update their availability list
            var doctor = await _firebaseService.GetDocument<Doctor>("doctors", availability.DoctorId);
            if (doctor == null)
            {
                _logger.LogWarning($"Doctor not found: {availability.DoctorId}");
                return NotFound($"Doctor with ID {availability.DoctorId} not found");
            }

            // Remove the availability ID from the doctor's list
            doctor.AvailabilityIds.Remove(availabilityId);
            await _firebaseService.UpdateDocument("doctors", doctor.Id, doctor);

            // Delete the availability
            await _firebaseService.DeleteDocument("availabilities", availabilityId);

            _logger.LogInformation($"Availability with ID {availabilityId} deleted successfully");
            return Ok(new { message = "Availability deleted successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error deleting availability: {availabilityId}");
            return StatusCode(500, "An error occurred while deleting availability");
        }
    }
<<<<<<< HEAD
}
=======

    [HttpGet("getDoctors")]
    public async Task<ActionResult<IEnumerable<Doctor>>> GetAllDoctors()
    {
        try
        {
            _logger.LogInformation("Fetching all doctors");
            var doctors = await _firebaseService.QueryCollection<Doctor>("doctors", d => true);
            _logger.LogInformation($"Successfully fetched {doctors.Count} doctors");
            return Ok(doctors);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching all doctors");
            return StatusCode(500, "An error occurred while fetching doctors");
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

            // Update patient's appointment list
            var patient = await _firebaseService.GetDocument<Patient>("patients", appointment.PatientId);
            if (patient != null)
            {
                patient.AppointmentIds = patient.AppointmentIds ?? new List<string>();
                patient.AppointmentIds.Add(appointment.Id);
                await _firebaseService.UpdateDocument("patients", patient.Id, patient);
            }

            // Update doctor's appointment list
            var doctor = await _firebaseService.GetDocument<Doctor>("doctors", appointment.DoctorId);
            if (doctor != null)
            {
                doctor.AppointmentIds = doctor.AppointmentIds ?? new List<string>();
                doctor.AppointmentIds.Add(appointment.Id);
                await _firebaseService.UpdateDocument("doctors", doctor.Id, doctor);
            }

            _logger.LogInformation($"Appointment booked successfully. ID: {appointment.Id}");
            return CreatedAtAction(nameof(GetDoctorAppointments), new { doctorId = appointment.DoctorId }, appointment);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error booking appointment");
            return StatusCode(500, "Error booking appointment");
        }
    }

    [HttpPut("appointments/{appointmentId}/approve")]
    public async Task<IActionResult> ApproveAppointment(string appointmentId)
    {
        try
        {
            _logger.LogInformation($"Approving appointment: {appointmentId}");

            // Get the appointment
            var appointment = await _firebaseService.GetDocument<Appointment>("appointments", appointmentId);
            if (appointment == null)
            {
                _logger.LogWarning($"Appointment not found: {appointmentId}");
                return NotFound("Appointment not found");
            }

            // Check if the appointment is in pending status
            if (appointment.IsConfirmed)
            {
                _logger.LogWarning($"Appointment {appointmentId} is already confirmed");
                return BadRequest("Appointment is already confirmed");
            }

            // Update the appointment status
            appointment.IsConfirmed = true;
            await _firebaseService.UpdateDocument("appointments", appointmentId, appointment);

            _logger.LogInformation($"Appointment {appointmentId} approved successfully");
            return Ok(new { message = "Appointment approved successfully", appointment });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error approving appointment: {appointmentId}");
            return StatusCode(500, "Error approving appointment");
        }
    }
}
>>>>>>> main
