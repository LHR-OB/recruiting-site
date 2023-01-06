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

export default function EditApplicationForm({ application }) {
  // States
  const [team, setTeam] = useState(application.team);
  const [selectedSystems, setSelectedSystems] = useState(application.systems);
  const [subsystems, setSubsystems] = useState(application.subsystems);
  const [phoneNumber, setPhoneNumber] = useState(application.phone_number);
  const [major, setMajor] = useState(application.major);
  const [yearEntering, setYearEntering] = useState(application.year_entering);
  const [shortAnswer, setShortAnswer] = useState(application.short_answer);
  const [resume, setResume] = useState(application.resume_link);
  const [systems, setSystems] = useState([]);
  const [teams, setTeams] = useState([]);

  const handleSaveApplication = () => {
    applicationsApi.updateApplication(application.id, {
      team_id: team.id,
      systems: selectedSystems.map(system => system.id),
      subsystems: subsystems,
      phone_number: phoneNumber,
      major: major,
      year_entering: yearEntering,
      short_answer: shortAnswer,
      resume_link: resume,
    }).then(res => {
      if (res.status === 200) {
        console.log('Application saved');
      }
    });
  }

  const handleSubmitApplication = () => {
    applicationsApi.updateApplication(application.id, {
      team_id: team.id,
      systems: selectedSystems.map(system => system.id),
      subsystems: subsystems,
      phone_number: phoneNumber,
      major: major,
      year_entering: yearEntering,
      short_answer: shortAnswer,
      resume_link: resume,
      status: "SUBMITTED"
    }).then(res => {
      if (res.status === 200) {
        console.log('Application submitted');
      }
    });
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
          Edit Application
        </Typography>
        <FormControl
          fullWidth
          variant="standard"
        >
          <InputLabel>Team</InputLabel>
          <Select
            value={JSON.stringify(team) || ''}
            label="Team"
            onChange={(e) => setTeam(JSON.parse(e.target.value))}
          >
            {teams.map(t => (
              <MenuItem key={t.id} value={JSON.stringify(t)}>{t.name}</MenuItem>
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
                  checked={selectedSystems.some(s => s.id === system.id)}
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
          onClick={handleSaveApplication}
          sx={{ marginTop: 2 }}
        >
          Save Application (Draft)
        </Button>
        <Button
          variant="outlined"
          onClick={handleSubmitApplication}
          color="success"
          sx={{ marginTop: 2 }}
        >
          Submit Application
        </Button>
      </Box>
    </Container>
  );
}
