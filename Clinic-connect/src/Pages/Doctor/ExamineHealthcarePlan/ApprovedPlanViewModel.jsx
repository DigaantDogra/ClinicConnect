import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../../Service/ApiService';

export const useApprovedPlanViewModel = () => {
    const [plan, setPlan] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApprovedPlan = async () => {
            try {
                setIsLoading(true);
                const doctorId = localStorage.getItem('doctorId');
                if (!doctorId) {
                    throw new Error('Doctor ID not found');
                }

                // For now, use doctorId as patientId for testing
                const plans = await ApiService.getPatientCarePlans(
                    parseInt(doctorId),
                    parseInt(doctorId)
                );
                
                if (plans && plans.length > 0) {
                    const approvedPlan = plans.find(p => p.status === 'approved');
                    if (approvedPlan) {
                        setPlan(approvedPlan);
                        localStorage.setItem('currentCarePlanId', approvedPlan.id);
                    } else {
                        navigate('/Doctor/GeneratePlan');
                    }
                } else {
                    navigate('/Doctor/GeneratePlan');
                }
            } catch (err) {
                setError(err.message);
                navigate('/Doctor/GeneratePlan');
            } finally {
                setIsLoading(false);
            }
        };

        fetchApprovedPlan();
    }, [navigate]);

    const handleBackToDraft = () => {
        navigate('/Doctor/DraftPlan');
    };

    const handleNewPlan = () => {
        localStorage.removeItem('currentCarePlanId');
        navigate('/Doctor/GeneratePlan');
    };

    return {
        plan,
        isLoading,
        error,
        handleBackToDraft,
        handleNewPlan
    };
}; 