namespace ClinicConnectService.Model;

public class Appointment
{
    public string Id { get; set; }
    public string PatientEmail { get; set; }
    public string DoctorEmail { get; set; }
    public string Date { get; set; }
    public string TimeSlot { get; set; }
    public string Reason { get; set; }
    public bool IsConfirmed { get; set; }
}
