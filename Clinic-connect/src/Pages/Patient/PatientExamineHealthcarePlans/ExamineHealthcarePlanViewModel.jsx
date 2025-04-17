import { useState, useEffect } from 'react';
import ApiService from '../../../Service/ApiService';

const useExamineHealthcarePlanViewModel = () => {
  const [carePlans, setCarePlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [doctorNames, setDoctorNames] = useState({});

  const fetchDoctorName = async (doctorId) => {
    try {
      const doctorInfo = await ApiService.getDoctorInfo(doctorId);
      setDoctorNames(prev => ({
        ...prev,
        [doctorId]: `${doctorInfo.firstName} ${doctorInfo.lastName}`
      }));
    } catch (err) {
      console.error(`Error fetching doctor name for ID ${doctorId}:`, err);
      setDoctorNames(prev => ({
        ...prev,
        [doctorId]: 'Unknown Doctor'
      }));
    }
  };

  const fetchCarePlans = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const patientId = localStorage.getItem('patientId');
      if (!patientId) {
        throw new Error('Patient ID not found');
      }

      const plans = await ApiService.getPatientCarePlans(patientId);
      
      // Filter for approved plans only
      const approvedPlans = plans.filter(plan => plan.status === 'approved');
      setCarePlans(approvedPlans);
      
      // Fetch doctor names for all plans
      approvedPlans.forEach(plan => {
        if (plan.doctorId && !doctorNames[plan.doctorId]) {
          fetchDoctorName(plan.doctorId);
        }
      });
      
      // If there are plans, select the most recent one by default
      if (approvedPlans.length > 0) {
        setSelectedPlan(approvedPlans[0]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
  };

  useEffect(() => {
    fetchCarePlans();
  }, []);

  return {
    carePlans,
    selectedPlan,
    loading,
    error,
    handlePlanSelect,
    refreshPlans: fetchCarePlans,
    doctorNames
  };
};

export default useExamineHealthcarePlanViewModel;
