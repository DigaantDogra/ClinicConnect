import { BackgroundCanvas } from "../../BackgroundCanvas";
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { BsFileEarmarkPlus, BsFileEarmark, BsFileCheck } from 'react-icons/bs';

export const DoctorHome = () => {
  const navigate = useNavigate();

  const dashboardCards = [
    {
      title: 'Generate New Plan',
      description: 'Create a new healthcare plan for your patient',
      icon: <BsFileEarmarkPlus className="text-4xl mb-4" />,
      action: () => navigate('/Doctor/GeneratePlan'),
      color: 'bg-blue-500'
    },
    {
      title: 'Review Draft Plans',
      description: 'View and edit draft healthcare plans',
      icon: <BsFileEarmark className="text-4xl mb-4" />,
      action: () => navigate('/Doctor/DraftPlan'),
      color: 'bg-yellow-500'
    },
    {
      title: 'Approved Plans',
      description: 'View approved healthcare plans',
      icon: <BsFileCheck className="text-4xl mb-4" />,
      action: () => navigate('/Doctor/Approval'),
      color: 'bg-green-500'
    }
  ];

  return (
    <BackgroundCanvas section={
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Doctor Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardCards.map((card, index) => (
            <div
              key={index}
              className={`${card.color} p-6 rounded-lg shadow-lg text-white hover:shadow-xl transition-shadow duration-300 cursor-pointer`}
              onClick={card.action}
            >
              <div className="flex flex-col items-center text-center">
                {card.icon}
                <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
                <p className="text-sm opacity-90">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    }/>
  );
}; 