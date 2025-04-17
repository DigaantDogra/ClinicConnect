static async generateCarePlan(doctorId, patientId, condition) {
    try {
        console.log('Generating care plan for patient:', patientId);
        
        // Format the request body
        const requestBody = {
            doctorId,
            patientId,
            condition: condition.trim(), // Just trim whitespace
            clinicalGuidance: condition.trim() // Use the same condition as guidance
        };
        
        console.log('Sending request with body:', requestBody);
        
        const response = await fetch(`${this.carePlanBaseUrl}/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error response:', errorData);
            throw new Error(`Failed to generate care plan: ${errorData.detail || 'An error occurred while generating the care plan'}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error generating care plan:', error);
        throw error;
    }
} 