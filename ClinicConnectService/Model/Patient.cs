namespace ClinicConnectService.Model;

public class Patient: User
{
    Patient(){
        Type = UserType.Patient;
    }

}
