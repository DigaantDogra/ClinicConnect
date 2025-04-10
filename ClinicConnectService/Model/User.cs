namespace ClinicConnectService.Model;

public class User
{
    public required string UserName { get; set; }
    public required string Email { get; set; }
    public UserType Type { get; protected set; }
    public List<Appointment>? Appointments { get; set; }
    public List<Notification>? Notifications { get; set; }
}
