import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch } from '../store/store';
import {
  getCurrentUser,
  getUserSelector,
} from '../store/user/currentUserSlice';
import { authSelector } from '../store/auth/authSlice';
import Typography from '@mui/material/Typography';
import { IUser } from '../types/types';

const ProfileScreen = () => {
  const { isLogin } = useSelector(authSelector);
  const dispatch = useDispatch<AppDispatch>();
  const { data, isError } = useSelector(getUserSelector);
  const [currentUser, setCurrentUser] = useState<IUser>();

  useEffect(() => {
    if (isLogin) {
      dispatch(getCurrentUser());
    }
  }, [isLogin, dispatch]);

  useEffect(() => {
    if (data !== null) {
      setCurrentUser(data);
    }
  }, [data]);

  return isError ? (
    <Typography>Ошибка получения пользователя</Typography>
  ) : (
    <div style={{ padding: '50px' }}>
      <Typography variant='h4' mt={10} mb={2}>
        Страница пользователя
      </Typography>

      <Typography>ЛОГИН {currentUser?.login}</Typography>
    </div>
  );
};
export default ProfileScreen;
