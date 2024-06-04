import { FC, useState } from 'react';
import { Box, Button, Dialog, Typography } from '@mui/material';

export interface ConfirmDialogProps {
  title: string;
  onClose: (value?: boolean) => void;
  onConfirm: () => void;
}

const ConfirmDialog: FC<ConfirmDialogProps> = ({
  title,
  onConfirm,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleSubmit = async () => {
    onConfirm();
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleCancel}>
      <Box display='flex' flexDirection='column' p={4} gap={3}>
        <Typography variant='h5'>{title}</Typography>
        <Box display='flex' gap={2}>
          <Button variant='outlined' color='primary' onClick={handleCancel}>
            Отмена
          </Button>
          <Button onClick={handleSubmit} variant='contained' color='primary'>
            Подтвердить
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default ConfirmDialog;
