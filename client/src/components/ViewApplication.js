import { React, useEffect } from 'react';
import {
  Container,
  Typography,
} from '@mui/material';

export default function ViewApplication({ application }) {
  return (
    <Container>
      <Typography variant="h4" mt={2}>
        {application?.user?.first_name + ' ' + application?.user?.last_name}
      </Typography>
      <Typography variant="h6" mt={2}>
        Team: {application?.team?.name}
      </Typography>
      <Typography variant="h6" mt={2}>
        Systems: {application?.systems?.map(s => s.name).join(', ')}
      </Typography>
      <Typography variant="h6" mt={2}>
        Subsystems: {application?.subsystems}
      </Typography>
      <Typography variant="h6" mt={2}>
        Email: {application?.user?.email}
      </Typography>
      <Typography variant="h6" mt={2}>
        Phone: {application?.phone_number}
      </Typography>
      <Typography variant="h6" mt={2}>
        Major: {application?.major}
      </Typography>
      <Typography variant="h6" mt={2}>
        Year Entering: {application?.year_entering}
      </Typography>
      <Typography variant="h6" mt={2}>
        Short Answer
      </Typography>
      <Typography variant="body1" mt={2}>
        {application?.short_answer}
      </Typography>
      <Typography variant="h6" mt={2}>
        Resume: {application?.resume_link}
      </Typography>
      <Typography variant="h6" mt={2}>
        Status: {application?.status}
      </Typography>
    </Container>
  );
}
