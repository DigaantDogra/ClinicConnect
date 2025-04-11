class ApiService {
    static baseUrl = 'http://localhost:5276/patient';
  
    static async getHeaders() {
      const token = localStorage.getItem('authToken');
      return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
    }
  
    static async createAppointment(appointment) {
      try {
        console.log('Attempting to create appointment at:', `${this.baseUrl}/appointment/create`);
        console.log('Request headers:', await this.getHeaders());
        console.log('Request body:', JSON.stringify(appointment));

        const response = await fetch(`${this.baseUrl}/appointment/create`, {
          method: 'POST',
          headers: await this.getHeaders(),
          body: JSON.stringify(appointment),
          mode: 'cors' // Explicitly set CORS mode
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

    static async getAppointments() {
      try {
        console.log('Attempting to fetch appointments from:', `${this.baseUrl}/appointment/get`);
        const response = await fetch(`${this.baseUrl}/appointment/get`, {
          method: 'GET',
          headers: await this.getHeaders(),
          mode: 'cors' // Explicitly set CORS mode
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
  }
  
  export default ApiService;