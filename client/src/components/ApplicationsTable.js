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

export default function ApplicationsTable({ user }) {
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

  return (
    <Container>
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
                  {application.team.name}
                </TableCell>
                <TableCell align="right">
                  {application.systems.reduce((acc, system) => {
                    return acc + system.name + ', ';
                  }, '').slice(0, -2)}
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
