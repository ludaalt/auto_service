import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  Button,
  Box,
  Typography,
} from '@mui/material';

import {
  getProposals,
  getProposalsSelector,
} from '../store/proposals/getproposalsSlice';
import { getObjectProperty } from '../helpers/getObjectProperty';
import type { IProposal } from '../types/types';
import type { AppDispatch } from '../store/store';
import { proposalListTableHeadCells } from '../const/const';
import { getDictionaryItem } from '../helpers/getDictionaryItem';

const ProposalListContainer = styled.div`
  padding: 40px;
`;

const StyledBox = styled(Box)`
  padding-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

import { getDictionarySelector } from '../store/dictionary/getDictionarySlice';

const ProposalList: FC = () => {
  const { data, waitProposalStatus } = useSelector(getProposalsSelector);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [dataRows, setDataRows] = useState([]);
  const dictionaryData = useSelector(getDictionarySelector).data;

  const convertedTableData = (data: IProposal[]) => {
    return data?.map((item: IProposal) => {
      return {
        ...item,
        city: {
          code: getDictionaryItem('CITIES', item.city.code as string),
        },
        auto: {
          autoCategory: {
            code: getDictionaryItem(
              'AUTO_CATEGORIES',
              item.auto?.autoCategory.code ||
                dictionaryData.AUTO_CATEGORIES.find(
                  (i) => i.id === item.autoCategoryId,
                )?.code,
            ),
          },
          model: {
            code: getDictionaryItem('AUTO', item.auto?.model.code as string),
          },
        },

        status: {
          code: getDictionaryItem(
            'STATUSES',
            (item.status?.code || item.status) as string,
          ),
        },
      };
    });
  };

  useEffect(() => {
    const socket = new WebSocket('ws://194.87.145.144:5000');

    socket.addEventListener('open', (event) => {
      socket.send('Соединение с сервером');
    });

    socket.addEventListener('message', (event) => {
      console.log('Обновление статуса заявки', event.data);
      dispatch(getProposals());
    });

    return () => socket.close();
  }, [waitProposalStatus, dispatch]);

  useEffect(() => {
    dispatch(getProposals());
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      setDataRows(convertedTableData(data));
    }
  }, [data]);

  interface ITableHeadCells {
    [key: string]: {
      label: string;
      rowProperty: string;
      dictionaryCode?: string;
    };
  }

  const tableHeadCells: ITableHeadCells = {
    1: {
      label: 'ID',
      rowProperty: 'id',
    },
    2: {
      label: 'Город',
      rowProperty: 'city.code' || 'city',
    },
    3: {
      label: 'Модель',
      rowProperty: 'auto.model.code' || 'model',
    },
    4: {
      label: 'Категория',
      rowProperty: 'auto.autoCategory.code' || 'autoCategory',
    },
    5: {
      label: 'Пользователь',
      rowProperty: 'person.firstName',
    },
    6: {
      label: 'Статус',
      rowProperty: 'status.code',
    },
  };

  const [orderDirection, setOrderDirection] = useState<
    'asc' | 'desc' | undefined
  >('asc');
  const [orderBy, setOrderBy] = useState<string>('id');

  // функция использует состояние компонента
  const sortArray = (arr: IProposal[], key: string) => {
    return [...arr].sort((a, b) => {
      const a_key = getObjectProperty(a, key);
      const b_key = getObjectProperty(b, key);
      if (orderDirection === 'asc') {
        setOrderDirection('desc');
        if (a_key > b_key) return 1;
        if (a_key < b_key) return -1;
        return 0;
      } else {
        setOrderDirection('asc');
        if (b_key > a_key) return 1;
        if (b_key < a_key) return -1;
        return 0;
      }
    });
  };

  const handleFilterArray = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string,
  ) => {
    if (e.target.value === '') {
      setDataRows(convertedTableData(data));
      return;
    } else {
      const newState = convertedTableData(data).filter((item: IProposal) => {
        return getObjectProperty(item, key)
          .toString()
          .toLowerCase()
          .includes(e.target.value.toLowerCase());
      });

      setDataRows(newState);
    }
  };

  const handleSortRequest = (e: React.MouseEvent, property: string) => {
    if (dataRows) {
      setOrderDirection(orderDirection === 'asc' ? 'desc' : 'asc');
      setOrderBy(property);

      const sortKey = tableHeadCells[property].rowProperty;
      setDataRows(sortArray(dataRows, sortKey));
    }
  };

  return (
    <ProposalListContainer>
      <StyledBox>
        <Typography variant='h5' mt={10}>
          Список заявок
        </Typography>

        <Button variant='outlined'>
          <Link to='/create-proposal'>Создать заявку</Link>
        </Button>
      </StyledBox>

      <TableContainer component={Paper}>
        <Table aria-label='simple table'>
          <TableHead>
            <TableRow>
              {proposalListTableHeadCells.map((item) => {
                return (
                  <TableCell key={item.id} component='th' align='center'>
                    <TableSortLabel
                      active={orderBy === item.cellName}
                      direction={orderDirection}
                      onClick={(e) => handleSortRequest(e, item.id)}
                      sx={{
                        display: 'flex',
                        gap: '10px',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                      }}
                    >
                      <span>{item.label}</span>
                      <p>
                        {' '}
                        <input
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => {
                            handleFilterArray(
                              e,
                              tableHeadCells[item.id].dictionaryCode ||
                                tableHeadCells[item.id].rowProperty,
                            );
                          }}
                        />
                      </p>
                    </TableSortLabel>
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {dataRows?.map((row: IProposal, id: number) => (
              <TableRow
                onClick={() => navigate(`/proposals/${row.id}`)}
                key={id}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell align='center'>{row.id}</TableCell>
                <TableCell align='center'>{row.city.code}</TableCell>
                <TableCell align='center'>{row.auto?.model.code}</TableCell>
                <TableCell align='center'>
                  {row.auto?.autoCategory.code}
                </TableCell>
                <TableCell align='center'>
                  {`${row.person?.firstName} ${row.person?.lastName}`}
                </TableCell>
                <TableCell align='center'>{row.status.code}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </ProposalListContainer>
  );
};

export default ProposalList;
