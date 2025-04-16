import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApiService } from '../../Services/ApiService';

const GeneratePlanPage = () => {
    const navigate = useNavigate();
    const [patientPrompt, setPatientPrompt] = useState('');
    const [generatedPlan, setGeneratedPlan] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGeneratePlan = async () => {
        try {
            setLoading(true);
            setError('');
            
            const response = await fetch('http://localhost:5276/api/careplan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(patientPrompt)
            });

            if (!response.ok) {
                throw new Error('Failed to generate care plan');
            }

            const data = await response.json();
            setGeneratedPlan(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h4" gutterBottom>
                Generate Care Plan
            </Typography>
            
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Patient Details"
                    value={patientPrompt}
                    onChange={(e) => setPatientPrompt(e.target.value)}
                    placeholder="Enter patient details, conditions, and any specific requirements..."
                    sx={{ mb: 2 }}
                />
                
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleGeneratePlan}
                    disabled={loading || !patientPrompt}
                    sx={{ mb: 2 }}
                >
                    {loading ? <CircularProgress size={24} /> : 'Generate Care Plan'}
                </Button>

                {error && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}
            </Paper>

            {generatedPlan && (
                <Paper elevation={3} sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Generated Care Plan
                    </Typography>
                    <Typography whiteSpace="pre-line">
                        {generatedPlan}
                    </Typography>
                </Paper>
            )}

            <Button
                variant="outlined"
                onClick={() => navigate('/')}
                sx={{ mt: 2 }}
            >
                Back to Home
            </Button>
        </Box>
    );
};

export default GeneratePlanPage; 