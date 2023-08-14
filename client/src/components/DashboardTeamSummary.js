import { React } from 'react';
import {
    Box,
    Typography,
} from '@mui/material';

export default function DashboardTeamSummary({ name }) {
    const TEAM_DATA = {
        'Combustion': {
            description: 'Combustion team description',
            workday_time: 'Combustion workday time',
            systems: [
                'System 1',
                'System 2',
            ],
            quote: 'Combustion quote',
        },
        'Electric': {
            description: 'Electric team description',
            workday_time: 'Electric workday time',
            systems: [
                'System 1',
                'System 2',
            ],
            quote: 'Electric quote',
        },
        'Solar': {
            description: 'Solar team description',
            workday_time: 'Solar workday time',
            systems: [
                'System 1',
                'System 2',
            ],
            quote: 'Solar quote',
        }
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Typography variant="h4" mt={2}>
                {name}
            </Typography>
            <Typography variant="body1" mt={2}>
                {TEAM_DATA[name].description}
            </Typography>
            <Typography variant="body1" mt={2}>
                Workday Time: {TEAM_DATA[name].workday_time}
            </Typography>
            <Typography variant="body1" mt={2}>
                Systems: {TEAM_DATA[name].systems.join(', ')}
            </Typography>
            <Typography variant="body1" mt={2} sx={{ fontStyle: 'italic' }}>
                "{TEAM_DATA[name].quote}"
            </Typography>
        </Box>
    );
}
