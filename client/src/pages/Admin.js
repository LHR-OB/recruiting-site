import { React } from 'react';
import {
  Box,
  Container,
  Typography,
} from '@mui/material';

export default function Admin() {
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
          Admin
        </Typography>
      </Box>
    </Container>
  );
}
