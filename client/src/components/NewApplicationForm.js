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
import consts from '../config/consts';

export default function NewApplicationForm({ setApplications, setSnackbarData, setOpen }) {
  // States
  const [team, setTeam] = useState(null);
  const [selectedSystems, setSelectedSystems] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [major, setMajor] = useState('');
  const [otherMajor, setOtherMajor] = useState('');
  const [yearEntering, setYearEntering] = useState('');
  const [shortAnswers, setShortAnswers] = useState(['', '', '', []]); // [shortAnswer1, shortAnswer2, shortAnswer3, shortAnswer4
  const [otherShortAnswerChoice, setOtherShortAnswerChoice] = useState('');
  const [resume, setResume] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [systems, setSystems] = useState([]);
  const [teams, setTeams] = useState([]);
  const [confirm, setConfirm] = useState(false);

  const handleSubmitApplication = () => {
    // Confirmation
    if (!confirm) {
      setConfirm(true);
      return;
    }
    // Verify phone number
    if (!phoneNumber.match(/^\d{10}$/)) {
      setSnackbarData({
        open: true,
        severity: 'error',
        message: 'Invalid phone number (must be 10 digits without dashes)',
      });
      return;
    }
    for (let system of selectedSystems) {
      applicationsApi.createApplication({
        team_id: team.id,
        system_id: system.id,
        phone_number: phoneNumber,
        major: major === 'Other' ? otherMajor : major,
        year_entering: yearEntering,
        short_answer1: shortAnswers[0],
        short_answer2: shortAnswers[1],
        short_answer4: shortAnswers[2],
        short_answer3: shortAnswers[3].join(', ') + (otherShortAnswerChoice ? ', ' + otherShortAnswerChoice : ''),
        resume_link: resume,
        portfolio_link: portfolio,
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
        <FormControl
          fullWidth
          variant="standard"
        >
          <InputLabel>Major</InputLabel>
          <Select
            value={major || ''}
            label="Major"
            onChange={(e) => setMajor(e.target.value)}
          >
            {consts.MAJORS.map(major => (
              <MenuItem key={major} value={major}>{major}</MenuItem>
            ))}
          </Select>
        </FormControl>
        {
          major === 'Other' &&
          <TextField
            label="Other Major"
            variant="standard"
            value={otherMajor}
            onChange={(e) => setOtherMajor(e.target.value)}
            sx={{ width: '100%' }}
          />
        }
        <FormControl
          fullWidth
          variant="standard"
        >
          <InputLabel>Year Entering</InputLabel>
          <Select
            value={yearEntering || ''}
            label="Year Entering"
            onChange={(e) => setYearEntering(e.target.value)}
          >
            {consts.YEARS.map(year => (
              <MenuItem key={year} value={year}>{year}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Phone Number"
          variant="standard"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          sx={{ width: '100%' }}
        />
        <TextField
          label="Resume Link"
          variant="standard"
          value={resume}
          onChange={(e) => setResume(e.target.value)}
          sx={{ width: '100%' }}
        />
        <TextField
          label="Portfolio Link"
          variant="standard"
          value={portfolio}
          onChange={(e) => setPortfolio(e.target.value)}
          sx={{ width: '100%' }}
        />
        <Typography variant="h6" mt={2}>
          Short Answer Questions
        </Typography>
        {consts.APPLICATION_QUESTIONS.map((question, index) => (
          <>
            <Typography variant="subtitle1" mt={2} key={index}>
              {question.question}
            </Typography>
            {question.options && (
              <>
                <Grid
                  container
                  direction="row"
                >
                  {question.options.map(option => (
                    <Grid item key={option} xs>
                      <FormControlLabel
                        control={<Checkbox
                          checked={shortAnswers[index].includes(option)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setShortAnswers(prev => {
                                let newAnswers = [...prev];
                                newAnswers[index] = [...newAnswers[index], option];
                                return newAnswers;
                              });
                            } else {
                              setShortAnswers(prev => {
                                let newAnswers = [...prev];
                                newAnswers[index] = newAnswers[index].filter(a => a !== option);
                                return newAnswers;
                              });
                            }
                          }} 
                        />}
                        label={option}
                      />
                    </Grid>
                  ))}
                </Grid>
                {shortAnswers[index].includes("Other") && (
                  <TextField
                    label={"Other"}
                    variant="standard"
                    value={otherShortAnswerChoice}
                    onChange={(e) => setOtherShortAnswerChoice(e.target.value)}
                    sx={{ width: '100%' }}
                  />
                )}
              </>
            )}
            {!question.options && (
              <TextField
                label={"Short Answer"}
                variant="standard"
                value={shortAnswers[index]}
                onChange={(e) => setShortAnswers(prev => {
                  let newAnswers = [...prev];
                  newAnswers[index] = e.target.value;
                  return newAnswers;
                })}
                multiline
                sx={{ width: '100%' }}
              />
            )}
          </>
        ))}
        <Button
          variant="outlined"
          onClick={handleSubmitApplication}
          sx={{ marginTop: 2 }}
        >
          {
            confirm ?
              "Confirm Submission (cannot be undone)" :
              "Submit Application"
          }
        </Button>
      </Box>
    </Container>
  );
}
