import styled from 'styled-components';
import Typography from '@mui/material/Typography';
import bg from '../assets/home-bg.jpg';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  background-image: url(${bg});
  background-size: cover;
`;

const HomePage = () => {
  return (
    <StyledContainer>
      <Typography variant='h1' color='#4e9be7' style={{ margin: 'auto 0' }}>
        Cервис регистрации автомобилей <br /> с каталогом авто
      </Typography>
    </StyledContainer>
  );
};

export default HomePage;
