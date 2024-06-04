import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const StyledContainer = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 10px;
`;

const NotAuthorized = () => {
  return (
    <StyledContainer>
      <Typography variant='body1'>Вы не авторизованы</Typography>

      <Button variant='outlined'>
        <Link to='/login'>Войти</Link>
      </Button>
    </StyledContainer>
  );
};

export default NotAuthorized;
