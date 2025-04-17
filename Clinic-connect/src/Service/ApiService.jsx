class ApiService {
  static baseUrl = 'http://localhost:5276';
  static patientBaseUrl = `${this.baseUrl}/patient`;
  static doctorBaseUrl = `${this.baseUrl}/doctor`;

  static async getHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  // Get user names by ID
  static async getPatientName(patientId) {
    try {
      console.log('Fetching patient name for ID:', patientId);
      const response = await fetch(`${this.patientBaseUrl}/${patientId}`, {
        method: 'GET',
        headers: await this.getHeaders()
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch patient name: ${errorText}`);
      }

      const name = await response.text();
      console.log('Patient name:', name);
      return name;
    } catch (error) {
      console.error('Error fetching patient name:', error);
      throw error;
    }
  }

  static async getDoctorName(doctorId) {
    try {
      console.log('Fetching doctor name for ID:', doctorId);
      const response = await fetch(`${this.doctorBaseUrl}/${doctorId}`, {
        method: 'GET',
        headers: await this.getHeaders()
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch doctor name: ${errorText}`);
      }

      const name = await response.text();
      console.log('Doctor name:', name);
      return name;
    } catch (error) {
      console.error('Error fetching doctor name:', error);
      throw error;
    }
  }

  // Patient Appointment Operations
  static async createAppointment(appointment) {
    try {
      console.log('Creating appointment:', appointment);
      const response = await fetch(`${this.patientBaseUrl}/appointments`, {
        method: 'POST',
        headers: await this.getHeaders(),
        body: JSON.stringify(appointment)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create appointment: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  }

  static async getAppointments(patientId) {
    try {
      console.log('Fetching appointments for patient:', patientId);
      const response = await fetch(`${this.patientBaseUrl}/appointments/${patientId}`, {
        method: 'GET',
        headers: await this.getHeaders()
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch appointments: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  }

  static async deleteAppointment(appointmentId) {
    try {
      console.log('Deleting appointment:', appointmentId);
      const response = await fetch(`${this.patientBaseUrl}/appointments/${appointmentId}`, {
        method: 'DELETE',
        headers: await this.getHeaders()
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete appointment: ${errorText}`);
      }

      return true;
    } catch (error) {
      console.error('Error deleting appointment:', error);
      throw error;
    }
  }

  // Doctor Operations
  static async getDoctorAppointments(doctorId) {
    try {
      console.log('Fetching appointments for doctor:', doctorId);
      const response = await fetch(`${this.doctorBaseUrl}/appointments/${doctorId}`, {
        method: 'GET',
        headers: await this.getHeaders()
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch doctor appointments: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching doctor appointments:', error);
      throw error;
    }
  }

  static async approveAppointment(appointmentId) {
    try {
      const response = await fetch(`${this.doctorBaseUrl}/appointments/${appointmentId}/approve`, {
        method: 'PUT',
        headers: await this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error approving appointment:', error);
      throw error;
    }
  }

  static async addAvailability(availability) {
    try {
      console.log('Adding availability:', availability);
      const response = await fetch(`${this.doctorBaseUrl}/availability`, {
        method: 'POST',
        headers: await this.getHeaders(),
        body: JSON.stringify(availability)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add availability: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding availability:', error);
      throw error;
    }
  }

  static async getDoctorAvailabilities(doctorId) {
    try {
      console.log('Fetching availabilities for doctor:', doctorId);
      const response = await fetch(`${this.doctorBaseUrl}/availability/${doctorId}`, {
        method: 'GET',
        headers: await this.getHeaders()
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch doctor availabilities: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching doctor availabilities:', error);
      throw error;
    }
  }

  static async deleteAvailability(availabilityId) {
    try {
      console.log('Deleting availability:', availabilityId);
      const response = await fetch(`${this.doctorBaseUrl}/availability/${availabilityId}`, {
        method: 'DELETE',
        headers: await this.getHeaders()
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete availability: ${errorText}`);
      }

      return true;
    } catch (error) {
      console.error('Error deleting availability:', error);
      throw error;
    }
  }

  static async getAllDoctors() {
    try {
      console.log('Fetching all doctors');
      const response = await fetch(`${this.doctorBaseUrl}/getDoctors`, {
        method: 'GET',
        headers: await this.getHeaders()
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch doctors: ${errorText}`);
      }

      const doctors = await response.json();
      console.log('Doctors fetched successfully:', doctors);
      return doctors;
    } catch (error) {
      console.error('Error fetching doctors:', error);
      throw error;
    }
  }
}

export default ApiService;