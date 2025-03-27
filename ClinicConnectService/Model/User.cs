namespace ClinicConnectService.Model;

public class User
{
    public required string UserName { get; set; }
    public required string Email { get; set; }
    public UserType UserType { get; protected set; }
    public required List<Appointment> Appointments { get; set; }
    public List<Notification>? Notifications { get; set; }
}
