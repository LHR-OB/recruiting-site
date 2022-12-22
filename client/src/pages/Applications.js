import { React, useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { applicationsApi, applicationCyclesApi } from '../api/endpoints/applications';

export default function Applications({ user }) {
  // States
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);

  useEffect(() => {
    if (user) {
      // Get application cycle
      applicationCyclesApi.getApplicationCycleActive().then(() => {
        // Get applications
        switch (user.type) {
          case "ADMIN":
            applicationsApi.getApplications().then((res) => {
              if (res.status === 200) {
                setApplications(res.data);
              }
            });
            break;
          case "TEAM_MANAGEMENT":
            applicationsApi.getApplicationsByTeam(user.team).then((res) => {
              if (res.status === 200) {
                setApplications(res.data);
              }
            });
            break;
          case "SYSTEM_LEAD":
            applicationsApi.getApplicationsBySystem(user.team, user.system).then((res) => {
              if (res.status === 200) {
                setApplications(res.data);
              }
            });
            break;
          case "INTERVIEWER":
            break;
          case "APPLICANT":
            break;
          default:
            break;
        }
      });
    }
  }, [user]);

  return (
    <Container>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" mt={2}>
          Applications
        </Typography>
        <br />
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Application Id</TableCell>
                <TableCell align="right">Major</TableCell>
                <TableCell align="right">Team</TableCell>
                <TableCell align="right">Systems</TableCell>
                <TableCell align="right">Resume</TableCell>
                <TableCell align="right">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.map((application, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">
                    {application.id}
                  </TableCell>
                  <TableCell align="right">
                    {application.major}
                  </TableCell>
                  <TableCell align="right">
                    {application.team}
                  </TableCell>
                  <TableCell align="right">
                    {application.systems}
                  </TableCell>
                  <TableCell align="right">
                    <a href={`//${application.resume_link}`} target="_blank" rel="noreferrer">
                      Resume
                    </a>
                  </TableCell>
                  <TableCell align="right">
                    {application.status}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
}
