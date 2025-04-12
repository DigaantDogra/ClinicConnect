using System.Collections.Generic;

namespace ClinicConnectService.Model;

public static class DataStorage
{
    public static List<Appointment> Appointments { get; } = new List<Appointment>();
    public static List<Availability> Availabilities { get; } = new List<Availability>();
} 