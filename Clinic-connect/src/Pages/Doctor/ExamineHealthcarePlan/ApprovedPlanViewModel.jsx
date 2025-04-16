import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApiService } from '../../Services/ApiService';

export const useApprovedPlanViewModel = () => {
    const [plan, setPlan] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const apiService = useApiService();

    useEffect(() => {
        const savedPlan = localStorage.getItem('generatedPlan');
        if (savedPlan) {
            const parsedPlan = JSON.parse(savedPlan);
            if (parsedPlan.status === 'approved') {
                setPlan(parsedPlan);
            } else {
                navigate('/Doctor/DraftPlan');
            }
        } else {
            navigate('/Doctor/GeneratePlan');
        }
    }, [navigate]);

    const handleBackToDraft = () => {
        navigate('/Doctor/DraftPlan');
    };

    const handleNewPlan = () => {
        localStorage.removeItem('generatedPlan');
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