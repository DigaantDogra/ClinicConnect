namespace ClinicConnectService.Model;

public class Availability
{
    public string Id { get; set; }
    public string DoctorEmail { get; set; }
    public string Date { get; set; }
    public string TimeSlot { get; set; }
    public bool IsAvailable { get; set; }
}
