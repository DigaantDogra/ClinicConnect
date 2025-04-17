class ApiService {
  static baseUrl = 'http://localhost:5276';
  static patientBaseUrl = `${this.baseUrl}/patient`;
  static doctorBaseUrl = `${this.baseUrl}/doctor`;
  static carePlanBaseUrl = `${this.baseUrl}/api/careplan`;

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

  // Doctor Care Plan Operations
  static async generateCarePlan(doctorId, patientId, patientCondition) {
    try {
      console.log('Generating care plan for patient:', patientId);
      
      // Ensure IDs are in the correct format without double-prefixing
      const formattedDoctorId = doctorId.startsWith('doctor-') ? doctorId : `doctor-${doctorId}`;
      const formattedPatientId = patientId.startsWith('patient-') ? patientId : `patient-${patientId}`;
      
      const requestBody = {
        doctorId: formattedDoctorId,
        patientId: formattedPatientId,
        condition: patientCondition,
        clinicalGuidance: patientCondition
      };

      console.log('Sending request with body:', requestBody);

      const response = await fetch(`${this.carePlanBaseUrl}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to generate care plan: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating care plan:', error);
      throw error;
    }
  }

  static async getPatientDetails(patientId) {
    try {
      const response = await fetch(`${this.patientBaseUrl}/${patientId}`, {
        method: 'GET',
        headers: await this.getHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch patient details');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching patient details:', error);
      throw error;
    }
  }

  static async getDoctorDetails(doctorId) {
    try {
      const response = await fetch(`${this.doctorBaseUrl}/${doctorId}`, {
        method: 'GET',
        headers: await this.getHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch doctor details');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching doctor details:', error);
      throw error;
    }
  }

  static async editCarePlan(doctorId, carePlanId, updatedPlan) {
    try {
      const response = await fetch(`${this.carePlanBaseUrl}/doctor/edit/${carePlanId}`, {
        method: 'PUT',
        headers: await this.getHeaders(),
        body: JSON.stringify({
          doctorId,
          updatedPlan
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to edit care plan: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error editing care plan:', error);
      throw error;
    }
  }

  static async approveCarePlan(doctorId, carePlanId) {
    try {
      const response = await fetch(`${this.carePlanBaseUrl}/doctor/approve/${carePlanId}`, {
        method: 'PUT',
        headers: await this.getHeaders(),
        body: JSON.stringify({
          doctorId
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to approve care plan: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error approving care plan:', error);
      throw error;
    }
  }

  async getPatientCarePlans(doctorId, patientId) {
    try {
      const response = await fetch(`${this.baseUrl}/api/careplan/doctor/${doctorId}/patient/${patientId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch patient care plans');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching patient care plans:', error);
      throw new Error(`Failed to fetch patient care plans: ${error.message}`);
    }
  }
}

export default ApiService;