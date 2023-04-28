import { React } from 'react';
import {
  Button,
  Container,
  Typography,
} from '@mui/material';
import usersApi from '../api/endpoints/users';

export default function PersonSummary({ person }) {

  const handleApproveButton = () => {
    usersApi.approveUser(person.id).then((res) => {
      if (res.status === 200) {
        console.log(res.data);
      }
    });
  }

  return (
    <Container>
      <Typography variant="h5" mt={2}>
        {person?.first_name + ' ' + person?.last_name}
      </Typography>
      <Typography variant="h6" mt={2}>
        Role: {person?.type}
      </Typography>
      <Typography variant="h6" mt={2}>
        Team: {person?.team?.name}
      </Typography>
      <Typography variant="h6" mt={2}>
        Systems: {person?.systems?.map((system) => system.name).join(', ')}
      </Typography>
      {person?.status === "UNAPPROVED" ?
        <Button
          variant="outlined"
          onClick={handleApproveButton}
          sx={{
            marginTop: 2,
          }}
        >
          Approve
        </Button>
        :
        null
      }
    </Container>
  );
}
