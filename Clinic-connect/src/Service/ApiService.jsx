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
      const response = await fetch(`${this.baseUrl}/appointment/create`, {
        method: 'POST',
        headers: await this.getHeaders(),
        body: JSON.stringify(appointment)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create appointment');
      }
      
      return await response.json();
    }

    static async getAppointments() {
      const response = await fetch(`${this.baseUrl}/appointment/get`, {
        method: 'GET',
        headers: await this.getHeaders()
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch appointments');
      }
      
      return await response.json();
    }
  }
  
  export default ApiService;