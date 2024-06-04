import Typography from '@mui/material/Typography';
import ProposalForm from '../components/ProposalForm';

const CreateProposal = () => {
  return (
    <div style={{ padding: '50px' }}>
      <Typography variant='h4' mt={10} mb={5}>
        Создать новую заявку
      </Typography>

      <ProposalForm mode='new' />
    </div>
  );
};

export default CreateProposal;
