import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../../Service/ApiService';

const useGeneratePlanViewModel = () => {
    const navigate = useNavigate();
    const [patientId, setPatientId] = useState('');
    const [patientCondition, setPatientCondition] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGeneratePlan = async () => {
        try {
            setIsLoading(true);
            setError('');
            
            const doctorId = localStorage.getItem('doctorId');
            if (!doctorId) {
                throw new Error('Doctor ID not found');
            }

            const response = await ApiService.generateCarePlan(
                parseInt(doctorId),
                parseInt(patientId),
                patientCondition
            );

            // Store the generated plan ID for later use
            localStorage.setItem('currentCarePlanId', response.id);
            
            // Navigate to the draft plan page
            navigate('/Doctor/DraftPlan');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        patientId,
        setPatientId,
        patientCondition,
        setPatientCondition,
        isLoading,
        error,
        handleGeneratePlan
    };
};

export default useGeneratePlanViewModel; 