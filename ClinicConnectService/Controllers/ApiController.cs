using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ClinicConnectService.Model;
using Microsoft.AspNetCore.Mvc;

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
    [HttpPost("appointment/create")]
    public IActionResult CreateAppointment([FromBody] Appointment appointment)
    {
        // Set patient email from authentication context
        appointment.Email = "example@example.com";
        
        // Add validation logic here
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        DataStorage.Appointments.Add(appointment);
        return CreatedAtAction(nameof(GetAppointments), appointment);
    }

    [HttpGet("appointment/get")]
    public IActionResult GetAppointments()
    {
        var patientEmail = "example@example.com";
        return Ok(DataStorage.Appointments.Where(a => a.Email == patientEmail));
    }
}
