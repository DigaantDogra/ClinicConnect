namespace ClinicConnectService.Model;

public class Appointment
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public required String Date { get; set; }
    public required String Reason { get; set; }
    public required String Day { get; set; }
    public required String Time { get; set; }
    public required string Email { get; set; }
}
