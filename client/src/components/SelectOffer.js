import { React, useState } from 'react';
import {
    Button,
    Box,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography,
} from '@mui/material';
import { applicationsApi } from '../api/endpoints/applications';


export default function SelectOffer({ applications, setApplications, setSnackbarData }) {
    // States
    const [application, setApplication] = useState({});

    const handleAcceptOffer = () => {
        const applicationOffers = applications.filter((application) => application.status === 'OFFER');
        for (let applicationOffer of applicationOffers) {
            if (applicationOffer.id !== application.id) {
                applicationsApi.updateApplication(applicationOffer.id, {
                    status: 'REJECTED',
                }).then((res) => {
                    if (res.status === 200) {
                        setApplications((curr) => {
                            const index = curr.findIndex((application) => application.id === applicationOffer.id);
                            curr[index].status = 'REJECTED';
                            return curr;
                        });
                    }
                });
            }
        }
        applicationsApi.updateApplication(application.id, {
            status: 'ACCEPTED',
        }).then((res) => {
            if (res.status === 200) {
                setApplications((curr) => {
                    const index = curr.findIndex((a) => a.id === application.id);
                    curr[index].status = 'ACCEPTED';
                    return curr;
                });
                setSnackbarData({
                    severity: 'success',
                    message: 'Offer accepted',
                    isOpen: true,
                });
            }
        });
    }

    return (
        <Container>
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'left',
                    width: '50%',
                }}
            >
                <Typography variant="h6" mt={2}>
                    Select Offer
                </Typography>
                <FormControl
                    variant="standard"
                >
                    <InputLabel>Offer</InputLabel>
                    <Select
                        value={application || ''}
                        label="Offer"
                        onChange={(e) => setApplication(e.target.value)}
                    >
                        {applications.filter((application) => application.status === 'OFFER').map((application) => (
                            <MenuItem
                                key={application.id}
                                value={application || ''}
                            >
                                {application.team.name} {application.system.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button
                    variant="outlined"
                    onClick={handleAcceptOffer}
                    sx={{ marginTop: 2 }}
                >
                    Accept
                </Button>
            </Box>
        </Container>
    );
}
