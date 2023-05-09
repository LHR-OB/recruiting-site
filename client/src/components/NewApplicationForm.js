import { React, useState, useEffect } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { applicationsApi } from '../api/endpoints/applications';
import { teamsApi, systemsApi } from '../api/endpoints/teams';

export default function NewApplicationForm({ setApplications, setSnackbarData, setOpen }) {
  // States
  const [team, setTeam] = useState(null);
  const [selectedSystems, setSelectedSystems] = useState([]);
  const [subsystems, setSubsystems] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [major, setMajor] = useState('');
  const [yearEntering, setYearEntering] = useState('');
  const [shortAnswer, setShortAnswer] = useState('');
  const [resume, setResume] = useState('');
  const [systems, setSystems] = useState([]);
  const [teams, setTeams] = useState([]);

  const handleSubmitApplication = () => {
    for (let system of selectedSystems) {
      applicationsApi.createApplication({
        team_id: team.id,
        system_id: system.id,
        subsystems: subsystems,
        phone_number: phoneNumber,
        major: major,
        year_entering: yearEntering,
        short_answer: shortAnswer,
        resume_link: resume,
        status: "SUBMITTED"
      }).then(res => {
        if (res.status === 200) {
          setApplications((curr) => [...curr, res.data]);
          setSnackbarData({
            open: true,
            severity: 'success',
            message: 'Application submitted successfully',
          });
          setOpen(false);
        }
      }, (err) => {
        setSnackbarData({
          open: true,
          severity: 'error',
          message: 'Error submitting application',
        });
      });
    }
  };

  useEffect(() => {
    // Get all teams
    teamsApi.getTeams().then(res => {
      if (res.status === 200) {
        setTeams(res.data);
      }
    });
  }, []);

  useEffect(() => {
    // Get all systems
    if (team) {
      systemsApi.getSystemsByTeam(team.id).then(res => {
        if (res.status === 200) {
          setSystems(res.data);
        }
      });
    }
  }, [team]);

  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" mt={2}>
          New Application
        </Typography>
        <FormControl
          fullWidth
          variant="standard"
        >
          <InputLabel>Team</InputLabel>
          <Select
            value={team || ''}
            label="Team"
            onChange={(e) => setTeam(e.target.value)}
          >
            {teams.map(team => (
              <MenuItem key={team.id} value={team}>{team.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography variant="h6" mt={2}>
          Systems
        </Typography>
        <Grid
          container
          direction="row"
        >
          {systems.map(system => (
            <Grid item key={system.id} xs>
              <FormControlLabel
                control={<Checkbox
                  checked={selectedSystems.includes(system)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedSystems([...selectedSystems, system]);
                    } else {
                      setSelectedSystems(selectedSystems.filter(s => s.id !== system.id));
                    }
                  }} 
                />}
                label={system.name}
              />
            </Grid>
          ))}
        </Grid>
        <TextField
          label="Subsystems (separated by semicolon)"
          variant="standard"
          value={subsystems}
          onChange={(e) => setSubsystems(e.target.value)}
          sx={{ width: '100%' }}
        />
        <TextField
          label="Phone Number"
          variant="standard"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          sx={{ width: '100%' }}
        />
        <TextField
          label="Major"
          variant="standard"
          value={major}
          onChange={(e) => setMajor(e.target.value)}
          sx={{ width: '100%' }}
        />
        <TextField
          label="Year Entering"
          variant="standard"
          value={yearEntering}
          onChange={(e) => setYearEntering(e.target.value)}
          sx={{ width: '100%' }}
        />
        <TextField
          label="Short Answer"
          variant="standard"
          value={shortAnswer}
          onChange={(e) => setShortAnswer(e.target.value)}
          multiline
          sx={{ width: '100%' }}
        />
        <TextField
          label="Resume Link"
          variant="standard"
          value={resume}
          onChange={(e) => setResume(e.target.value)}
          sx={{ width: '100%' }}
        />
        <Button
          variant="outlined"
          onClick={handleSubmitApplication}
          sx={{ marginTop: 2 }}
        >
          Submit Application
        </Button>
      </Box>
    </Container>
  );
}
