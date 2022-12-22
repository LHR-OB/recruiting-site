import { React } from 'react';
import {
  Box,
  Container,
  Typography,
} from '@mui/material';


export default function TeamManagement() {
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
          Team Management
        </Typography>
      </Box>
    </Container>
  );
}
