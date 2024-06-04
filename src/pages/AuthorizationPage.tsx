import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TextField, Button, Typography } from '@mui/material';

import { loginUser, authSelector } from '../store/auth/authSlice';
import type { ILogin } from '../types/types';
import type { AppDispatch } from '../store/store';

const FormContainer = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const ErrorLabel = styled(Typography)`
  color: red;
  position: relative;
  top: -20px;
`;

const schema = yup.object().shape({
  login: yup.string().required('Введите логин'),
  password: yup
    .string()
    .min(8, 'Пароль должен быть длинее 8 символов')
    .max(30, 'Пароль должен быть короче 30 символов')
    .required('Введите пароль'),
});

const AuthorizationPage: FC = () => {
  const { isSuccess, isError } = useSelector(authSelector);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [authorizationError, setAuthorizationError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmitHandler = (data: ILogin) => {
    dispatch(loginUser(data));
    reset();
  };

  useEffect(() => {
    if (isError) {
      setAuthorizationError(true);
    }

    if (isSuccess) {
      navigate('/');
    }
  }, [isSuccess, navigate, isError]);

  return authorizationError ? (
    <Typography pt={20} pl={4}>
      Ошибка авторизации. Пожалуйста, попробуйте войти ещё раз{' '}
    </Typography>
  ) : (
    <FormContainer>
      <StyledForm onSubmit={handleSubmit(onSubmitHandler)}>
        <Typography variant='h5' mb={5}>
          Пожалуйста, авторизуйтесь
        </Typography>

        <TextField
          label='Логин'
          required
          variant='outlined'
          type='text'
          sx={{ mb: 3 }}
          {...register('login')}
          // autoComplete='off'
        />
        <ErrorLabel sx={{ fontSize: 12 }}>{errors.login?.message}</ErrorLabel>

        <TextField
          label='Пароль'
          required
          variant='outlined'
          type='password'
          sx={{ mb: 3 }}
          {...register('password')}
        />
        <ErrorLabel sx={{ fontSize: 12 }}>
          {errors.password?.message}
        </ErrorLabel>

        <Button variant='contained' type='submit'>
          Отправить
        </Button>
      </StyledForm>
    </FormContainer>
  );
};

export default AuthorizationPage;
