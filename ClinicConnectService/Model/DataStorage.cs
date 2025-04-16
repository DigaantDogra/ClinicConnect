using System;
using System.Collections.Generic;

namespace ClinicConnectService.Model;

public static class DataStorage
{
    public static List<Patient> Patients { get; } = new List<Patient>();
    public static List<Doctor> Doctors { get; } = new List<Doctor>();
    public static List<Appointment> Appointments { get; } = new List<Appointment>();
    public static List<Availability> Availabilities { get; } = new List<Availability>();

    static DataStorage()
    {
        // Initialize Patients
        Patients.AddRange(new List<Patient>
        {
            new Patient
            {
                Id = "1",
                Name = "John Doe",
                Email = "john.doe@example.com",
                Phone = "123-456-7890",
                Address = "123 Main St, City, State"
            },
            new Patient
            {
                Id = "2",
                Name = "Jane Smith",
                Email = "jane.smith@example.com",
                Phone = "234-567-8901",
                Address = "456 Oak Ave, City, State"
            },
            new Patient
            {
                Id = "3",
                Name = "Robert Johnson",
                Email = "robert.johnson@example.com",
                Phone = "345-678-9012",
                Address = "789 Pine Rd, City, State"
            }
        });

        // Initialize Doctors
        Doctors.AddRange(new List<Doctor>
        {
            new Doctor
            {
                Id = "1",
                Name = "Dr. Sarah Williams",
                Email = "sarah.williams@example.com",
                Phone = "456-789-0123",
                Specialization = "Cardiology",
                Address = "321 Medical Center Dr, City, State"
            },
            new Doctor
            {
                Id = "2",
                Name = "Dr. Michael Brown",
                Email = "michael.brown@example.com",
                Phone = "567-890-1234",
                Specialization = "Pediatrics",
                Address = "654 Health Park Ave, City, State"
            },
            new Doctor
            {
                Id = "3",
                Name = "Dr. Emily Davis",
                Email = "emily.davis@example.com",
                Phone = "678-901-2345",
                Specialization = "Dermatology",
                Address = "987 Wellness Blvd, City, State"
            }
        });
    }
} 