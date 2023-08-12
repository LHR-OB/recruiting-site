import { React, useEffect } from 'react';
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
import SelectOffer from './SelectOffer';

export default function ApplicationsTable({ user, setOpen, setModalMode, setApplication, applications, setApplications, setSnackbarData }) {
  useEffect(() => {
    if (user && setApplications) {
      // Get application cycle
      applicationCyclesApi.getApplicationCycleActive().then((res) => {
        // Get applications
        const applicationCycle = res.data;
        switch (user.type) {
          case "ADMIN":
            applicationsApi.getApplicationsByCycle(applicationCycle.id).then((res) => {
              if (res.status === 200) {
                setApplications(res.data);
              }
            });
            break;
          case "TEAM_MANAGEMENT":
            applicationsApi.getApplicationsByTeam(applicationCycle.id, user.team.id).then((res) => {
              if (res.status === 200) {
                setApplications(res.data);
              }
            });
            break;
          case "SYSTEM_LEAD":
          case "INTERVIEWER":
            let newApplications = [];
            const callback = (res) => {
              if (res.status === 200) {
                newApplications = [...newApplications, ...res.data];
                setApplications(newApplications);
              }
            }
            for (let system of user.systems) {
              applicationsApi.getApplicationsBySystem(applicationCycle.id, user.team.id, system.id).then(callback);
            }
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
  }, [user, setApplications]);

  const handleApplicationClick = (application) => {
    setOpen(true);
    setApplication(application);
    setModalMode('VIEW')
  }

  const getBackgroundColor = (application) => {
    if (user.type !== 'APPLICANT' && !application.status.includes("REJECTED")) {
      switch (application.stage_decision) {
        case 'ACCEPT':
          return 'green';
        case 'REJECT':
          return 'red';
        default:
          return 'white';
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
              <TableCell align="right">Name</TableCell>
              <TableCell align="right">Team</TableCell>
              <TableCell align="right">System</TableCell>
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
                    backgroundColor: getBackgroundColor(application)
                  }}
                >
                  {application.id}
                </TableCell>
                <TableCell align="right">
                  {application?.user?.first_name} {application?.user?.last_name}
                </TableCell>
                <TableCell align="right">
                  {application?.team?.name}
                </TableCell>
                <TableCell align="right">
                  {application?.system?.name}
                </TableCell>
                <TableCell align="right">
                  {application?.major}
                </TableCell>
                <TableCell align="right">
                  <a href={`//${application?.resume_link}`} target="_blank" rel="noreferrer">
                    Resume
                  </a>
                </TableCell>
                <TableCell align="right">
                  {application?.status}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {
        user?.type === 'APPLICANT' && applications.some((application) => application.status === 'OFFER') &&
        <SelectOffer applications={applications} setApplications={setApplications} setSnackbarData={setSnackbarData} />
      }
    </Container>
  );
}
