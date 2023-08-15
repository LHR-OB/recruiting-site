import { React } from 'react';
import {
    Box,
    Grid,
    List,
    ListItemButton,
    ListItemIcon,
    Typography,
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';

export default function DashboardFooter() {
    const FOOTER_LINKS = [
        {
            label: 'Website',
            link: 'https://longhornracing.org/',
            icon: <LanguageIcon />,
        },
        {
            label: 'Instagram',
            link: 'https://www.instagram.com/longhornracing/',
            icon: <InstagramIcon />,
        },
        {
            label: 'LinkedIn',
            link: 'https://www.linkedin.com/company/longhorn-racing/',
            icon: <LinkedInIcon />,
        },
        {
            label: 'Email',
            link: 'mailto:lhr@utexas.edu',
            icon: <EmailIcon />,
        }
    ]

    return (
        <Box
            sx={{
                marginTop: 8,
                backgroundColor: '#F5F5F5',
            }}
        >
            <Grid container>
                <Grid item xs={2}>
                    <Box
                        sx={{
                            paddingTop: 2,
                            marginLeft: 8,
                        }}
                    >
                        <Typography variant="h6">
                            Contact Information
                        </Typography>
                            <List>
                            {FOOTER_LINKS.map((item) => (
                                <ListItemButton
                                    key={item.label}
                                    onClick={() => window.open(item.link, '_blank')}
                                >
                                    <ListItemIcon>
                                        {item.icon}
                                    </ListItemIcon>
                                    <Typography variant="body1">
                                        {item.label}
                                    </Typography>
                                </ListItemButton>
                            ))}
                        </List>
                    </Box>
                </Grid>
                <Grid item xs={8} />
                <Grid item xs={2}>
                    <Box
                        sx={{
                            paddingTop: 2,
                            marginRight: 8,
                        }}
                    >
                        <Typography variant="body2">
                            © 2023 Longhorn Racing
                        </Typography>
                        <Typography variant="body2">
                            This site was developed with love by Rishi Ponnekanti (LHR Solar Captain 2022-2023)
                        </Typography>
                        <Typography variant="body2">
                            If anything breaks, it's not his fault
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                marginTop: 2,
                                fontStyle: 'italic',
                            }}
                        >
                            "Autobots, roll out!"
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}
