import { useEffect, FC, useState } from 'react';
import { useParams } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { Alert, Typography, Box } from '@mui/material';

import ProposalForm from '../components/ProposalForm';
import {
  getProposalsSelector,
  getProposalById,
  getProposalStatus,
} from '../store/proposals/getproposalsSlice';
import { getDictionarySelector } from '../store/dictionary/getDictionarySlice';
import type { AppDispatch } from '../store/store';
import { getDictionaryItem } from '../helpers/getDictionaryItem';

import Loader from '../components/Loader';

const ProposalStatuses = {
  DRAFT: '',
  PENDING: {
    alertStatus: 'info',
    alertText: 'Заявка находится на рассмотрении',
  },
  REJECTED: {
    alertStatus: 'error',
    alertText: 'Ваша заявка отклонена',
  },
  SUCCESS: {
    alertStatus: 'success',
    alertText: 'Вы успешно зарегистрировали заявку',
  },
};

type Severity = 'error' | 'success' | 'info' | 'warning';

const ProposalItem: FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { currentProposal, isFetching } = useSelector(getProposalsSelector);
  const dictionaryData = useSelector(getDictionarySelector).data;

  const [isWaitingProposalStatus, setIsWaitingProposalStatus] = useState(false);

  useEffect(() => {
    if (currentProposal?.status.code === 'PENDING') {
      setIsWaitingProposalStatus(true);
    } else {
      setIsWaitingProposalStatus(false);
    }
  }, [currentProposal?.status]);

  useEffect(() => {
    dispatch(getProposalById(Number(id)));
  }, []);

  useEffect(() => {
    const updateStatusTimer = setInterval(() => {
      if (isWaitingProposalStatus) {
        dispatch(getProposalStatus(currentProposal.id));
      }
    }, 5000);

    return () => {
      clearInterval(updateStatusTimer);
    };
  }, [isWaitingProposalStatus]);

  const STATUS =
    currentProposal &&
    (currentProposal.status.code as keyof typeof ProposalStatuses);

  return isFetching ? (
    <Loader />
  ) : (
    currentProposal && dictionaryData && (
      <Box p={7}>
        <Typography variant='h4' mt={10} mb={2}>
          Страница заявки
        </Typography>

        {STATUS != 'DRAFT' && (
          <>
            <Alert
              severity={ProposalStatuses[STATUS]?.['alertStatus'] as Severity}
              sx={{ marginBottom: '10px' }}
            >
              {ProposalStatuses[STATUS]?.['alertText']}
            </Alert>

            <Typography>Идентификатор заявки: {currentProposal.id}</Typography>
            <Typography>
              Статус заявки:{' '}
              {getDictionaryItem('STATUSES', currentProposal.status.code)}
            </Typography>
            <Typography>
              Город: {getDictionaryItem('CITIES', currentProposal.city.code)}
            </Typography>
            <Typography>
              Категория:{' '}
              {getDictionaryItem(
                'AUTO_CATEGORIES',
                currentProposal.auto.autoCategory.code,
              )}
            </Typography>
            <Typography>
              Модель:{' '}
              {getDictionaryItem('AUTO', currentProposal.auto.model.code)}
            </Typography>
            <Typography>
              {`${currentProposal.person.firstName} ${currentProposal.person.lastName}`}
            </Typography>
          </>
        )}

        {STATUS === 'DRAFT' && (
          <>
            <Typography variant='h5' mb={5}>
              Черновик заявки
            </Typography>
            <ProposalForm
              mode='draft'
              proposal={currentProposal}
              onStatusWaitHandle={(val) => setIsWaitingProposalStatus(val)}
            />
          </>
        )}
      </Box>
    )
  );
};

export default ProposalItem;
