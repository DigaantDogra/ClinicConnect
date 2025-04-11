namespace ClinicConnectService.Model;

public class Doctor: User
{
    Doctor(){
        Type = UserType.Doctor;
    }

    public List<Availability>? Availabilities { get; set; }
}
