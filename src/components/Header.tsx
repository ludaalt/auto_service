import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

import { authSelector } from '../store/auth/authSlice';
import { logoutUser } from '../store/auth/authSlice';
import type { AppDispatch } from '../store/store';

const StyledHeader = styled.header`
  padding: 20px 30px;
  background-color: #fff;
  opacity: 0.9;
  display: flex;
  justify-content: space-between;

  position: fixed;
  z-index: 10;
  width: 100%;
  max-width: 2500px;

  box-shadow:
    rgba(0, 0, 0, 0.1) 0px 4px 6px -1px,
    rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;

  nav {
    display: flex;
    align-items: center;
    gap: 30px;

    a.active {
      font-weight: bold;
      pointer-events: none;
    }
  }
`;

const Header = () => {
  const { isLogin } = useSelector(authSelector);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  return (
    <StyledHeader>
      <nav>
        <NavLink to='/'>Главная страница</NavLink>
        <NavLink to='/proposals' end>
          Список заявок
        </NavLink>
        <NavLink to='/autos'>Каталог автомобилей</NavLink>
        <NavLink to='/profile'>Профиль</NavLink>
      </nav>

      {!isLogin ? (
        <Button variant='outlined'>
          <Link reloadDocument to='/login'>
            Войти
          </Link>
        </Button>
      ) : (
        <Button variant='outlined' onClick={logoutHandler}>
          Выйти
        </Button>
      )}
    </StyledHeader>
  );
};
export default Header;
