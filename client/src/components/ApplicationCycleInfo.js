import { React, useState, useEffect } from 'react';
import {
  Button,
  Container,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import { applicationCyclesApi } from '../api/endpoints/applications';
import NewApplicationCycleForm from './NewApplicationCycleForm';
import EditApplicationCycleForm from './EditApplicationCycleForm';
import CenterModal from './CenterModal';

export default function ApplicationCycleInfo() {
  // States
  const [applicationCycles, setApplicationCycles] = useState([]);
  const [editApplicationCycle, setEditApplicationCycle] = useState(null);
  const [open, setOpen] = useState(false);
  const [modalMode, setModalMode] = useState('');

  useEffect(() => {
    applicationCyclesApi.getApplicationCycles().then((res) => {
      if (res.status === 200) {
        setApplicationCycles(res.data);
      }
    });
  }, []);

  const handleNewApplicationCycleButton = () => {
    setOpen(true);
    setModalMode('NEW');
  };

  const handleClickApplicationCycle = (applicationCycle) => {
    setOpen(true);
    setModalMode('EDIT');
    setEditApplicationCycle(applicationCycle);
  }

  return (
    <Container>
      <Typography variant="h6" mt={2}>
        Application Cycle Info
      </Typography>
      <List>
        {applicationCycles.map((applicationCycle) => (
          <ListItem key={applicationCycle.id}>
            <ListItemButton
              onClick={() => {handleClickApplicationCycle(applicationCycle)}}
            >
              <ListItemText
                primary={applicationCycle.semester + ' ' + applicationCycle.year}
                secondary={applicationCycle.is_active ? applicationCycle.stage : 'Inactive'}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Button
        variant="outlined"
        onClick={handleNewApplicationCycleButton}
        sx={{
          marginTop: 2,
        }}
      >
        New Application Cycle
      </Button>
      <CenterModal
        open={open}
        handleClose={() => setOpen(false)}
      >
        {modalMode === 'NEW' ? <NewApplicationCycleForm /> : <EditApplicationCycleForm applicationCycle={editApplicationCycle} />}
      </CenterModal>
    </Container>
  );
}
