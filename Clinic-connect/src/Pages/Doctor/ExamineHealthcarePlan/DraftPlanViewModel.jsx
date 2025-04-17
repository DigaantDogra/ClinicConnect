import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../../Service/ApiService';

export function useDraftPlanViewModel() {
    const [plan, setPlan] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedPlan, setEditedPlan] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDraftPlan();
    }, []);

    const fetchDraftPlan = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            // Get doctor ID from localStorage
            const doctorId = localStorage.getItem('doctorId');
            if (!doctorId) {
                throw new Error('Doctor ID not found');
            }

            // Get care plan ID from localStorage
            const carePlanId = localStorage.getItem('generatedPlanId');
            if (!carePlanId) {
                throw new Error('Care plan ID not found');
            }

            // Get patient ID from the care plan
            const carePlan = await ApiService.getCarePlan(carePlanId);
            if (!carePlan) {
                throw new Error('Care plan not found');
            }

            // Fetch all care plans for this patient
            const carePlans = await ApiService.getPatientCarePlans(doctorId, carePlan.patientId);
            
            // Find the draft plan
            const draftPlan = carePlans.find(p => p.status === 'draft');
            if (!draftPlan) {
                throw new Error('No draft plan found');
            }

            setPlan(draftPlan);
            setEditedPlan(draftPlan.plan);
        } catch (error) {
            console.error('Error fetching draft plan:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const doctorId = localStorage.getItem('doctorId');
            if (!doctorId) {
                throw new Error('Doctor ID not found');
            }

            await ApiService.editCarePlan({
                carePlanId: plan.id,
                doctorId: doctorId,
                plan: editedPlan
            });

            setIsEditing(false);
            await fetchDraftPlan();
        } catch (error) {
            console.error('Error saving plan:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleApprove = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const doctorId = localStorage.getItem('doctorId');
            if (!doctorId) {
                throw new Error('Doctor ID not found');
            }

            await ApiService.approveCarePlan({
                carePlanId: plan.id,
                doctorId: doctorId,
                notes: 'Plan approved'
            });

            navigate('/doctor/approved-plan');
        } catch (error) {
            console.error('Error approving plan:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        plan,
        isEditing,
        editedPlan,
        isLoading,
        error,
        setIsEditing,
        setEditedPlan,
        handleSave,
        handleApprove
    };
} 