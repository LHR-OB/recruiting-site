import { React } from 'react';
import {
    Box,
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
        </Box>
    );
}
