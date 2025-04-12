namespace ClinicConnectService.Model;

public class Availability
{
    public required string StartDate { get; set; }
    public required string EndDate { get; set; }
    public required List<string> TimeSlots { get; set; }
}
