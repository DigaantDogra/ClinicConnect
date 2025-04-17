import React from 'react';
import { useUser } from '../../../Context/UserContext';
import { BackgroundCanvas } from "../../BackgroundCanvas";
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

export const DoctorHome = () => {
  const { getUserId, userData } = useUser();
  const userId = getUserId();
  const navigate = useNavigate();

  return (
    <BackgroundCanvas section={
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Welcome to Your Dashboard</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Your Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Name:</p>
              <p className="font-medium">{userData?.name}</p>
            </div>
            <div>
              <p className="text-gray-600">Email:</p>
              <p className="font-medium">{userData?.email}</p>
            </div>
            <div>
              <p className="text-gray-600">User ID:</p>
              <p className="font-medium">{userId}</p>
            </div>
          </div>
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/Doctor/GeneratePlan')}
          sx={{ mt: 2 }}
        >
          Generate Care Plan
        </Button>
      </div>
    }/>
  );
};
 