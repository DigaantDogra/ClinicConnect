import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApiService } from '../../Services/ApiService';

export const useDraftPlanViewModel = () => {
    const [plan, setPlan] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedPlan, setEditedPlan] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const apiService = useApiService();

    useEffect(() => {
        const savedPlan = localStorage.getItem('generatedPlan');
        if (savedPlan) {
            setPlan(JSON.parse(savedPlan));
            setEditedPlan(JSON.parse(savedPlan).plan);
        }
    }, []);

    const handleSave = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const updatedPlan = {
                ...plan,
                plan: editedPlan,
                status: 'draft'
            };
            
            // Save the updated plan
            localStorage.setItem('generatedPlan', JSON.stringify(updatedPlan));
            setPlan(updatedPlan);
            setIsEditing(false);
        } catch (err) {
            setError(err.message || 'Failed to save plan');
        } finally {
            setIsLoading(false);
        }
    };

    const handleApprove = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const approvedPlan = {
                ...plan,
                plan: editedPlan,
                status: 'approved',
                approvedDate: new Date().toISOString()
            };
            
            // Save the approved plan
            localStorage.setItem('generatedPlan', JSON.stringify(approvedPlan));
            setPlan(approvedPlan);
            navigate('/Doctor/ApprovedPlan');
        } catch (err) {
            setError(err.message || 'Failed to approve plan');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        plan,
        isEditing,
        setIsEditing,
        editedPlan,
        setEditedPlan,
        isLoading,
        error,
        handleSave,
        handleApprove
    };
}; 