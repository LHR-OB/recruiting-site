import { React, useEffect, useState } from 'react';
import {
  Button,
  Container,
  FormControl,
  FormGroup,
  FormControlLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
  Switch,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { applicationsApi, applicationCyclesApi } from '../api/endpoints/applications';
import SelectOffer from './SelectOffer';

export default function ApplicationsTable({ user, setOpen, setModalMode, setApplication, applications, setApplications, setSnackbarData }) {
  const [unfilteredApplications, setUnfilteredApplications] = useState([]); // For filtering applications
  const [orderBy, setOrderBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [hideRejected, setHideRejected] = useState(false); // For hiding rejected applications
  
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
                setUnfilteredApplications(res.data);
              }
            });
            break;
          case "TEAM_MANAGEMENT":
            applicationsApi.getApplicationsByTeam(applicationCycle.id, user.team.id).then((res) => {
              if (res.status === 200) {
                setApplications(res.data);
                setUnfilteredApplications(res.data);
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
                setUnfilteredApplications(newApplications);
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
                setUnfilteredApplications(res.data);
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

  const handleSearch = (event) => {
    const search = event.target.value;
    if (search === '') {
      setApplications(unfilteredApplications);
      return;
    }
    const filteredApplications = unfilteredApplications.filter((application) => {
      const searchString = `${application.id} ${application.user.first_name} ${application.user.last_name} ${application.team.name} ${application.system.name} ${application.major} ${application.status}`;
      return search.split(' ').every((word) => (searchString.toLowerCase().includes(word.toLowerCase())));
    });
    setApplications(filteredApplications);
  }
  
  const handleSort = (id, compare) => {
    const newOrderBy = id;
    const newSortOrder = (orderBy === id && sortOrder === 'asc') ? 'desc' : 'asc';
    const sortedApplications = [...applications].sort(compare);
    if (newSortOrder === 'desc') {
      sortedApplications.reverse();
    }
    setApplications(sortedApplications);
    setOrderBy(newOrderBy);
    setSortOrder(newSortOrder);
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const cleanForCSV = (str) => {
    return `"${str.replace(/"/g, '""')}"`;
  }

  const handleDownload = () => {
    const csv = applications.map((application) => {
      const row = [];
      row.push(application.id);
      row.push(`${application.user.first_name} ${application.user.last_name}`);
      row.push(application.user.email);
      row.push(application.phone_number);
      row.push(cleanForCSV(application.major));
      row.push(application.year_entering);
      row.push(application.team.name);
      row.push(application.system.name);
      row.push(cleanForCSV(application.short_answer1));
      row.push(cleanForCSV(application.short_answer2));
      row.push(cleanForCSV(application.short_answer3));
      row.push(cleanForCSV(application.short_answer4));
      row.push(application.resume_link);
      row.push(application.portfolio_link || '');
      row.push(application.status);
      row.push(application.stage_decision);
      return row.join(',');
    });
    csv.unshift('Application Id,Name,Email,Phone Number,Major,Year Entering,Team,System,Short Answer 1,Short Answer 2,Short Answer 3,Short Answer 4,Resume,Portfolio,Status,Stage Decision');
    const csvString = csv.join('\n');
    const csvData = new Blob([csvString], {type: 'text/csv;charset=utf-8;'});
    const csvURL =  window.URL.createObjectURL(csvData);
    const tempLink = document.createElement('a');
    tempLink.href = csvURL;
    tempLink.setAttribute('download', 'applications.csv');
    tempLink.click();
  }

  const getBackgroundColor = (application) => {
    if (user.type !== 'APPLICANT' && !application?.status?.includes("REJECTED")) {
      switch (application.stage_decision) {
        case 'ACCEPT':
          return 'green';
        case 'POSITIVE':
          return 'lightgreen';
        case 'NEGATIVE':
          return 'orange';
        case 'REJECT':
          return 'red';
        default:
          return 'white';
      }
    } else {
      return 'white';
    }
  }

  const getApplicantStatus = (application) => {
    if (application?.status?.includes("REJECTED") && application.status !== "SUBMITTED") {
      return "REVIEW";
    } else {
      return application?.status;
    }
  }

  const getFullLink = (link) => {
    if (link.includes('http')) {
      return link;
    } else {
      return `//${link}`;
    }
  }

  const TABLE_HEADERS = [
    {
      'id': 'application_id',
      'label': 'Application Id',
      'compare': (a, b) => (a.id > b.id) ? 1 : -1,
    },
    {
      'id': 'name',
      'label': 'Name',
      'compare': (a, b) => (`${a.user?.first_name} ${a.user?.last_name}` > `${b.user?.first_name} ${b.user?.last_name}`) ? 1 : -1,
    },
    {
      'id': 'team',
      'label': 'Team',
      'compare': (a, b) => (a.team?.name > b.team?.name) ? 1 : -1,
    },
    {
      'id': 'system',
      'label': 'System',
      'compare': (a, b) => (a.system?.name > b.system?.name) ? 1 : -1,
    },
    {
      'id': 'major',
      'label': 'Major',
      'compare': (a, b) => (a.major > b.major) ? 1 : -1,
    },
    {
      'id': 'resume',
      'label': 'Resume',
      'compare': (a, b) => (a.resume_link > b.resume_link) ? 1 : -1,
    },
    {
      'id': 'status',
      'label': 'Status',
      'compare': (a, b) => (a.status > b.status) ? 1 : -1,
    },
  ];

  if (!applications) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
    </div>
  );

  return (
    <Container>
      <TextField
        sx={{ width: '100%', marginBottom: 2, marginTop: 2 }}
        label="Search"
        variant="outlined"
        onChange={handleSearch}
      />
      <Button
        sx={{ marginBottom: 2 }}
        variant="outlined"
        onClick={handleDownload}
      >
        Export to CSV
      </Button>
      <br />
      {/* Hide Rejected */}
      {
        user?.type !== 'APPLICANT' &&
        <FormControl>
          <FormGroup>
            <FormControlLabel
              control={<Switch checked={hideRejected} onChange={() => setHideRejected(!hideRejected)} />}
              label="Hide Rejected"
            />
          </FormGroup>
        </FormControl>
      }
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {TABLE_HEADERS.map((header, i) => (
                <TableCell key={header.id} align={i > 0 ? "right" : "left"}>
                  <TableSortLabel
                    active={orderBy === header.id}
                    direction={orderBy === header.id ? sortOrder : 'asc'}
                    onClick={() => handleSort(header.id, header['compare'])}
                  >
                    {header.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {applications && applications.filter(application => (!(hideRejected && application.status.includes("REJECTED")))).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((application, index) => (
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
                  <Typography
                    variant="body2"
                    sx={{
                      maxWidth: 200, // percentage also works
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {application?.major}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <a href={getFullLink(application?.resume_link)} target="_blank" rel="noreferrer">
                    Resume
                  </a>
                </TableCell>
                <TableCell align="right">
                  {user?.type === 'APPLICANT' ?
                    getApplicantStatus(application)
                  :
                    application?.status}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={applications?.filter(application => (!(hideRejected && application?.status?.includes("REJECTED")))).length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      {
        user?.type === 'APPLICANT' && applications.some((application) => application.status === 'OFFER') &&
        <SelectOffer applications={applications} setApplications={setApplications} setSnackbarData={setSnackbarData} />
      }
    </Container>
  );
}
