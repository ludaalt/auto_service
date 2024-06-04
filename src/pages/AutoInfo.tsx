import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';

import type { AppDispatch } from '../store/store';
import {
  getAutoInfo,
  getAutoInfoSelector,
} from '../store/autoInfo/autoInfoSlice';
import { authSelector } from '../store/auth/authSlice';

import Loader from '../components/Loader';
import { autosDescription } from '../data/data';

const StyledAutoInfo = styled.div`
  padding: 50px;
`;

const AutoInfo = () => {
  const { data, isFetching } = useSelector(getAutoInfoSelector);
  const { isLogin } = useSelector(authSelector);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (data.length === 0 && isLogin) {
      dispatch(getAutoInfo());
    }
  }, [isLogin, dispatch, data]);

  return isFetching ? (
    <Loader />
  ) : (
    <StyledAutoInfo>
      <Typography variant='h4' mb={5} mt={10}>
        Информация об автомобилях
      </Typography>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead>
            <TableRow>
              {['Название', 'Описание', 'Фотография'].map((item, id) => {
                return (
                  <TableCell key={id} component='th' align='center'>
                    {item}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((row) => (
              <TableRow key={row.id}>
                <TableCell align='center'>
                  <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                    {row.name}
                  </Typography>
                </TableCell>
                <TableCell align='center'>
                  {autosDescription[row.code]}
                </TableCell>

                <TableCell
                  align='center'
                  sx={{
                    width: '400px',
                  }}
                >
                  <img
                    src={`./src/assets/autos/${row.code}.jpg`}
                    alt={`${row.code} photo`}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </StyledAutoInfo>
  );
};

export default AutoInfo;
