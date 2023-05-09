import { React, useState } from 'react';
import {
  Button,
  Container,
  Typography,
} from '@mui/material';

import CenterModal from './CenterModal';
import EditApplicationInfoForm from './EditApplicationInfoForm';

export default function ApplicationInfo({ team }) {
  // States
  const [open, setOpen] = useState(false);

  const handleEditApplicationInfo = () => {
    setOpen(true);
  }

  return (
    <Container>
      <Typography variant="h6" mt={2}>
        Application Info
      </Typography>
      <Typography variant="body1" mt={2}>
        TODO: Application Summary Goes Here
      </Typography>
      <Button
        variant="outlined"
        onClick={handleEditApplicationInfo}
        sx={{ mt: 2 }}
      >
        Edit Application Info
      </Button>
      <CenterModal
        open={open}
        handleClose={() => {setOpen(false)}}
      >
        <EditApplicationInfoForm team={team} />
      </CenterModal>
    </Container>
  );
}
