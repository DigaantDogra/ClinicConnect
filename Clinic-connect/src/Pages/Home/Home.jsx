import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/generate-plan')}
        sx={{ mt: 2 }}
      >
        Generate Care Plan
      </Button>
    </div>
  );
};

export default Home; 