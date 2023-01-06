import { React, useEffect, useState } from 'react';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { applicationsApi, applicationCyclesApi } from '../api/endpoints/applications';

export default function ApplicationsTable({ user, setOpen, setModalMode, setApplication }) {
  // States
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);

  useEffect(() => {
    if (user) {
      // Get application cycle
      // TOOD: Filter by active application cycle instead of throwing away response
      applicationCyclesApi.getApplicationCycleActive().then((res) => {
        // Get applications
        const applicationCycle = res.data;
        switch (user.type) {
          case "ADMIN":
            applicationsApi.getApplications().then((res) => {
              if (res.status === 200) {
                setApplications(res.data.filter(a => a.status !== 'DRAFT'));
              }
            });
            break;
          case "TEAM_MANAGEMENT":
            applicationsApi.getApplicationsByTeam(user.team).then((res) => {
              if (res.status === 200) {
                setApplications(res.data.filter(a => a.status !== 'DRAFT'));
              }
            });
            break;
          case "SYSTEM_LEAD":
            applicationsApi.getApplicationsBySystem(user.team, user.system).then((res) => {
              if (res.status === 200) {
                setApplications(res.data.filter(a => a.status !== 'DRAFT'));
              }
            });
            break;
          case "INTERVIEWER":
            break;
          case "APPLICANT":
            applicationsApi.getApplicationsByUser(applicationCycle.id, user.id).then((res) => {
              if (res.status === 200) {
                setApplications(res.data);
              }
            });
            break;
          default:
            break;
        }
      });
    }
  }, [user]);

  const handleApplicationClick = (application) => {
    setOpen(true);
    setApplication(application);
    if (application.status === "DRAFT") {
      setModalMode('EDIT');
    } else {
      setModalMode('VIEW');
    }
  }

  const getBackgroundColor = (stage_decision) => {
    if (user.type !== 'APPLICANT') {
      switch (stage_decision) {
        case 'ACCEPT':
          return 'green';
        case 'REJECT':
          return 'red';
      }
    } else {
      return 'white';
    }
  }

  return (
    <Container>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Application Id</TableCell>
              <TableCell align="right">Team</TableCell>
              <TableCell align="right">Systems</TableCell>
              <TableCell align="right">Major</TableCell>
              <TableCell align="right">Resume</TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.map((application, index) => (
              <TableRow
                key={index}
                onClick={() => handleApplicationClick(application)}
                sx={{
                  '&:hover': {cursor: 'pointer', backgroundColor: 'grey.100'},
                }}
              >
                <TableCell 
                  component="th"
                  scope="row" 
                  sx={{
                    backgroundColor: getBackgroundColor(application.stage_decision)
                  }}
                >
                  {application.id}
                </TableCell>
                <TableCell align="right">
                  {application.team.name}
                </TableCell>
                <TableCell align="right">
                  {application.systems.map(s => s.name).join(', ')}
                </TableCell>
                <TableCell align="right">
                  {application.major}
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
    </Container>
  );
}
