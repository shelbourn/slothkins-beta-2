import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    Container,
    Button,
    MenuItem
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import Sloth from '../Assets/sloth-icon-header.png';

const MainHeader = () => {
    const [anchorElNav, setAnchorElNav] = React.useState(null);

    const navigate = useNavigate();

    const navPages = [
        { name: 'Home', target: '/' },
        { name: 'K-means Clustering', target: '/k-means-clustering' },
        { name: 'Logistic Regression Analysis', target: '/logistic-regression' }
    ];

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleSelectNav = (event) => {
        navigate(`${event.target.value}`);
    };

    const handleSelectNavMenu = (event) => {
        const { target } = event.currentTarget.dataset;
        navigate(`${target}`);
    };
    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <img src={Sloth} alt="Slothkins-beta-2" />
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{
                            mr: 2,
                            ml: 2,
                            display: { xs: 'flex', md: 'flex' },
                            flexGrow: 1,
                            justifyContent: 'flex-start'
                        }}
                    >
                        SLOTHKINS BETA-2
                    </Typography>

                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: 'flex', md: 'none' },
                            justifyContent: 'flex-end'
                        }}
                    >
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left'
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left'
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' }
                            }}
                        >
                            {navPages.map((page) => (
                                <MenuItem
                                    key={page.name}
                                    onClick={handleSelectNavMenu}
                                    data-target={page.target}
                                >
                                    <Typography textAlign="center">
                                        {page.name}
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: 'none', md: 'flex' },
                            justifyContent: 'flex-end'
                        }}
                    >
                        {navPages.map((page) => (
                            <Button
                                key={page.name}
                                onClick={handleSelectNav}
                                value={page.target}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                {page.name}
                            </Button>
                        ))}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};
export default MainHeader;
