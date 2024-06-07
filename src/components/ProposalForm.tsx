import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styled from 'styled-components';
import { TextField, Button, MenuItem, Typography } from '@mui/material';

import type { AppDispatch } from '../store/store';
import { IDictionary, IProposal, IFormProposalData } from '../types/types';
import { getDictionarySelector } from '../store/dictionary/getDictionarySlice';
import { convertProposalObject } from '../helpers/convertProposalObject';
import {
  getProposalsSelector,
  deleteProposal,
  updateDraftProposal,
  sentReadyDraft,
  createNewProposal,
} from '../store/proposals/getproposalsSlice';
import ConfirmDialog from './ConfirmDialog';
import Loader from './Loader';
import { getDictionaryItem } from '../helpers/getDictionaryItem';

const StyledForm = styled.form`
  width: 400px;
  display: flex;
  flex-direction: column;
`;

const ErrorLabel = styled(Typography)`
  color: red;
  position: relative;
  top: -20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
`;

const schema = yup.object().shape({
  firstName: yup.string().required('Введите имя'),
  lastName: yup.string().required('Введите фамилию'),
  driverLicense: yup
    .string()
    .required('Введите лицензию')
    .matches(/^[0-9]{4} [0-9]{6}$/, 'Неверный формат'),
  email: yup.string().email().required('Введите email'),
  city: yup.string().required('Введите город'),
  autoCategory: yup.string().required('Введите категорию автомобиля'),
  model: yup.string().required('Введите модель автомобиля'),
});

interface ProposalFormProps {
  mode: 'new' | 'draft';
  proposal?: Partial<IProposal> & Pick<IProposal, 'id'>;
  onStatusWaitHandle?: (value: boolean) => void;
}

const ProposalForm: FC<ProposalFormProps> = ({
  mode,
  proposal,
  onStatusWaitHandle,
}) => {
  const navigate = useNavigate();
  const dictionaryData = useSelector(getDictionarySelector).data;
  const dispatch = useDispatch<AppDispatch>();
  const proposalsTotalCount = useSelector(getProposalsSelector).data.length;

  const [categoriesModels, setCategoriesModels] = useState<IDictionary[]>([]);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isSentReadyDraft, setIsSentReadyDraft] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmitHandler = async (data: IFormProposalData) => {
    if (mode === 'new') {
      const convertedProposalData = convertProposalObject(
        data,
        dictionaryData,
        proposalsTotalCount + 1000,
      );

      await dispatch(createNewProposal(convertedProposalData));
      navigate('/proposals');
    }

    if (mode === 'draft') {
      const convertedProposalData = convertProposalObject(
        data,
        dictionaryData,
        proposal!.id,
      );

      await dispatch(sentReadyDraft(convertedProposalData));
      onStatusWaitHandle?.(true);
      setIsSentReadyDraft(true);
    }
  };

  const saveDraftProposal = () => {
    const isAnyDataInForm =
      Object.values(getValues()).filter((item) => !!item).length > 0;

    if (isAnyDataInForm) {
      const draftProposal = {
        ...convertProposalObject(getValues(), dictionaryData, proposal!.id),
      };

      dispatch(updateDraftProposal(draftProposal));
      navigate('/proposals');
    }
  };

  const autoCategoryChoiceHandle = () => {
    const currentCategoryValue = getValues('autoCategory');
    const currentCategoryId = dictionaryData?.AUTO_CATEGORIES.find(
      (item: IDictionary) => item.name === currentCategoryValue,
    )?.id;

    const categoriesModels = dictionaryData?.AUTO?.filter(
      (item: IDictionary) => item.categoryId === currentCategoryId,
    );

    if (categoriesModels.length > 0) {
      setCategoriesModels(categoriesModels);
    }
  };

  useEffect(() => {
    autoCategoryChoiceHandle();
  }, []);

  const handleProposalDeleting = async () => {
    await dispatch(deleteProposal(proposal!.id));

    setIsConfirmDialogOpen(false);
    navigate('/proposals');
  };

  return isSentReadyDraft ? (
    <Loader />
  ) : (
    <>
      <StyledForm onSubmit={handleSubmit(onSubmitHandler)}>
        <TextField
          InputLabelProps={{
            shrink: true,
          }}
          label='Ваше имя'
          required
          variant='outlined'
          type='text'
          sx={{ mb: 3 }}
          {...register('firstName')}
          autoComplete='off'
          defaultValue={proposal?.person?.firstName ?? ''}
        />
        <ErrorLabel sx={{ fontSize: 12 }}>
          {errors.firstName?.message}
        </ErrorLabel>

        <TextField
          InputLabelProps={{
            shrink: true,
          }}
          label='Ваша фамилия'
          required
          variant='outlined'
          type='text'
          sx={{ mb: 3 }}
          {...register('lastName')}
          autoComplete='off'
          defaultValue={proposal?.person?.lastName ?? ''}
        />
        <ErrorLabel sx={{ fontSize: 12 }}>
          {errors.lastName?.message}
        </ErrorLabel>

        <TextField
          InputLabelProps={{
            shrink: true,
          }}
          label='Лицензия'
          required
          variant='outlined'
          type='text'
          sx={{ mb: 3 }}
          {...register('driverLicense')}
          autoComplete='off'
          placeholder='Введите лицензию в формате 1234 567890'
          defaultValue={proposal?.person?.driverLicense ?? ''}
        />

        <ErrorLabel sx={{ fontSize: 12 }}>
          {errors.driverLicense?.message}
        </ErrorLabel>

        <TextField
          InputLabelProps={{
            shrink: true,
          }}
          label='Email'
          required
          variant='outlined'
          type='email'
          sx={{ mb: 3 }}
          {...register('email')}
          autoComplete='off'
          defaultValue={proposal?.person?.email ?? ''}
        />
        <ErrorLabel sx={{ fontSize: 12 }}>{errors.email?.message}</ErrorLabel>

        <TextField
          sx={{ mb: 3 }}
          select
          fullWidth
          label='Город'
          defaultValue={
            proposal?.city && getDictionaryItem('CITIES', proposal.city.code)
          }
          required
          inputProps={register('city')}
        >
          {dictionaryData?.CITIES?.map((item: IDictionary) => (
            <MenuItem key={item.id} value={item.name}>
              {item.name}
            </MenuItem>
          ))}
        </TextField>

        <ErrorLabel sx={{ fontSize: 12 }}>{errors.city?.message}</ErrorLabel>

        <TextField
          sx={{ mb: 3 }}
          select
          fullWidth
          label='Категория'
          required
          inputProps={register('autoCategory')}
          onChange={autoCategoryChoiceHandle}
          defaultValue={
            proposal &&
            getDictionaryItem(
              'AUTO_CATEGORIES',
              proposal.auto?.autoCategory?.code,
            )
          }
        >
          {dictionaryData?.AUTO_CATEGORIES?.map((item: IDictionary) => (
            <MenuItem key={item.id} value={item.name}>
              {item.name}
            </MenuItem>
          ))}
        </TextField>

        <ErrorLabel sx={{ fontSize: 12 }}>
          {errors.autoCategory?.message}
        </ErrorLabel>

        <TextField
          sx={{ mb: 3 }}
          required
          select
          fullWidth
          label='Модель'
          defaultValue={
            proposal?.auto &&
            getDictionaryItem('AUTO', proposal.auto.model.code)
          }
          inputProps={register('model')}
          disabled={categoriesModels.length === 0}
        >
          {categoriesModels.map((item: IDictionary) => (
            <MenuItem key={item.id} value={item.name}>
              {item.name}
            </MenuItem>
          ))}
        </TextField>
        <ErrorLabel sx={{ fontSize: 12 }}>{errors.model?.message}</ErrorLabel>

        <ButtonContainer>
          {mode === 'draft' && (
            <Button
              variant='outlined'
              type='button'
              onClick={saveDraftProposal}
            >
              Сохранить
            </Button>
          )}

          <Button variant='contained' type='submit'>
            Отправить
          </Button>

          {mode === 'draft' ? (
            <Button
              variant='contained'
              type='button'
              color='error'
              onClick={() => setIsConfirmDialogOpen(true)}
            >
              Удалить
            </Button>
          ) : null}
        </ButtonContainer>
      </StyledForm>

      {isConfirmDialogOpen && (
        <ConfirmDialog
          title='Вы уверены, что хотите удалить черновик заявки?'
          onClose={() => setIsConfirmDialogOpen(false)}
          onConfirm={handleProposalDeleting}
        />
      )}
    </>
  );
};

export default ProposalForm;
