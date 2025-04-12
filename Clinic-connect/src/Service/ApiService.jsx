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
  
    static async createAppointment(appointment) {
      try {
        console.log('Attempting to create appointment at:', `${this.patientBaseUrl}/appointments`);
        console.log('Request headers:', await this.getHeaders());
        console.log('Request body:', JSON.stringify(appointment));

        const response = await fetch(`${this.patientBaseUrl}/appointments`, {
          method: 'POST',
          headers: await this.getHeaders(),
          body: JSON.stringify(appointment),
          mode: 'cors'
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`Server responded with status ${response.status}: ${errorText}`);
        }
        
        const result = await response.json();
        console.log('Appointment created successfully:', result);
        return result;
      } catch (error) {
        console.error('Detailed error in createAppointment:', error);
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Cannot connect to the server. Please ensure the backend is running at http://localhost:5276');
        }
        throw error;
      }
    }

    static async getAppointments(patientEmail) {
      try {
        console.log('Attempting to fetch appointments from:', `${this.patientBaseUrl}/appointments/${patientEmail}`);
        const response = await fetch(`${this.patientBaseUrl}/appointments/${patientEmail}`, {
          method: 'GET',
          headers: await this.getHeaders(),
          mode: 'cors'
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`Server responded with status ${response.status}: ${errorText}`);
        }
        
        const result = await response.json();
        console.log('Appointments fetched successfully:', result);
        return result;
      } catch (error) {
        console.error('Detailed error in getAppointments:', error);
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Cannot connect to the server. Please ensure the backend is running at http://localhost:5276');
        }
        throw error;
      }
    }

    static async deleteAppointment(appointmentId) {
      try {
        console.log('Attempting to delete appointment with ID:', appointmentId);
        const response = await fetch(`${this.patientBaseUrl}/appointments/${appointmentId}`, {
          method: 'DELETE',
          headers: await this.getHeaders()
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`Failed to delete appointment: ${errorText}`);
        }
        
        return true;
      } catch (error) {
        console.error('Error deleting appointment:', error);
        throw error;
      }
    }

    static async editAppointment(appointmentData) {
      try {
        console.log('Attempting to edit appointment:', appointmentData);
        const response = await fetch(`${this.patientBaseUrl}/appointment/edit`, {
          method: 'PUT',
          headers: await this.getHeaders(),
          body: JSON.stringify(appointmentData)
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`Failed to edit appointment: ${errorText}`);
        }
        
        return true;
      } catch (error) {
        console.error('Error editing appointment:', error);
        throw error;
      }
    }

    // Doctor API endpoints
    static async getDoctorAppointments(doctorEmail) {
      try {
        console.log('Fetching doctor appointments from:', `${this.doctorBaseUrl}/appointments/${doctorEmail}`);
        const response = await fetch(`${this.doctorBaseUrl}/appointments/${doctorEmail}`, {
          method: 'GET',
          headers: await this.getHeaders()
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`Server responded with status ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        console.log('Doctor appointments fetched successfully:', result);
        return result;
      } catch (error) {
        console.error('Error fetching doctor appointments:', error);
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Cannot connect to the server. Please ensure the backend is running at http://localhost:5276');
        }
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
          console.error('Error response:', errorText);
          throw new Error(`Server responded with status ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        console.log('Availability added successfully:', result);
        return result;
      } catch (error) {
        console.error('Error adding availability:', error);
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Cannot connect to the server. Please ensure the backend is running at http://localhost:5276');
        }
        throw error;
      }
    }

    static async getDoctorAvailabilities(doctorEmail) {
      try {
        console.log('Fetching doctor availabilities from:', `${this.doctorBaseUrl}/availability/${doctorEmail}`);
        const response = await fetch(`${this.doctorBaseUrl}/availability/${doctorEmail}`, {
          method: 'GET',
          headers: await this.getHeaders()
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`Server responded with status ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        console.log('Doctor availabilities fetched successfully:', result);
        return result;
      } catch (error) {
        console.error('Error fetching doctor availabilities:', error);
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Cannot connect to the server. Please ensure the backend is running at http://localhost:5276');
        }
        throw error;
      }
    }
  }
  
  export default ApiService;