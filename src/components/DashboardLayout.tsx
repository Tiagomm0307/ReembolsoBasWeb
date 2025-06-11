import React, { type ReactNode, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    List,
    Typography,
    ListItem,
    ListItemButton,
    ListItemText,
    IconButton,
    Menu,
    MenuItem,
    useTheme,
    useMediaQuery,
    Button,
    Divider,
    Stack,
} from '@mui/material';
import {
    Logout,
    AccountCircle,
    Menu as MenuIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import ApartmentIcon from '@mui/icons-material/Apartment';
import BusinessIcon from '@mui/icons-material/Business';
import PortraitIcon from '@mui/icons-material/Portrait';
import { blueGrey } from '@mui/material/colors';
import { authService } from '../service/authService';

const drawerWidth = 280;
const mobileDrawerWidth = 260;

export interface MenuItem {
    label: string;
    path: string;
    icon: ReactNode;
}

export interface DashboardLayoutProps {
    children: ReactNode;
    title: string;
    menuItems: MenuItem[];
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
    children,
    title,
    menuItems
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();

    const perfil = authService.getPerfil();
    const matricula = authService.getMatricula();
    const nome = authService.getNome();
    const diretoria = authService.getDiretoria();
    const superintendência = authService.getSuperintendencia();

    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

    const handleDrawerToggle = () => {
        setMobileDrawerOpen(!mobileDrawerOpen);
    };

    const handleUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setUserMenuAnchor(event.currentTarget);
    };

    const handleUserMenuClose = () => {
        setUserMenuAnchor(null);
    };

    const handleLogout = () => {
        navigate('/login');
        handleUserMenuClose();
    };

    const handleMenuItemClick = (path: string) => {
        navigate(path);
        if (isMobile) {
            setMobileDrawerOpen(false);
        }
    };

    const drawerContent = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box
                sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isMobile ? 'space-between' : 'center',
                    gap: 1,
                    color: 'white',
                    minHeight: 64,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <i className="fas fa-shield-alt fa-2x"></i>
                    <Typography
                        variant={isMobile ? 'h6' : 'h5'}
                        fontWeight="bold"
                        sx={{ fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.5rem' } }}
                    >
                        BAS Saúde
                    </Typography>
                </Box>
                {isMobile && (
                    <IconButton onClick={handleDrawerToggle} sx={{ color: 'white' }}>
                        <CloseIcon />
                    </IconButton>
                )}
            </Box>

            <List sx={{ color: 'white', px: 1 }}>
                {menuItems.map((item) => (
                    <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                        <ListItemButton
                            selected={location.pathname === item.path}
                            onClick={() => handleMenuItemClick(item.path)}
                            sx={{
                                borderRadius: 1,
                                mx: 1,
                                '&.Mui-selected': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                },
                                '&.Mui-selected:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                },
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    mr: 2,
                                    fontSize: { xs: '1rem', md: '1.2rem' },
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                {item.icon}
                            </Box>
                            <ListItemText
                                primary={item.label}
                                slotProps={{
                                    primary: {
                                        sx: {
                                            fontSize: { xs: '0.9rem', md: '1rem' },
                                        },
                                    },
                                }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            <Box sx={{ flexGrow: 1 }} />

            <Box sx={{ p: 2 }}>
                <Button
                    variant="contained"
                    color="error"
                    fullWidth
                    startIcon={<Logout />}
                    onClick={handleLogout}
                    sx={{ borderRadius: 2, textTransform: 'none' }}
                >
                    Sair
                </Button>
            </Box>
        </Box>
    );

    const userMenuItems = [
        { label: nome, icon: <PersonIcon fontSize="small" sx={{ mr: 1 }} /> },
        { label: perfil, icon: <PortraitIcon fontSize="small" sx={{ mr: 1 }} /> },
        { label: matricula, icon: <BadgeIcon fontSize="small" sx={{ mr: 1 }} /> },
        { label: diretoria, icon: <ApartmentIcon fontSize="small" sx={{ mr: 1 }} /> },
        { label: superintendência, icon: <BusinessIcon fontSize="small" sx={{ mr: 1 }} /> },
    ];

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar
                position="fixed"
                sx={{
                    width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
                    ml: { xs: 0, md: `${drawerWidth}px` },
                    backgroundColor: 'white',
                    color: 'rgb(30 41 59 / var(--tw-bg-opacity, 1))',
                    boxShadow: 1,
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
            >
                <Toolbar>
                    {isMobile && (
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}

                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ flexGrow: 1, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
                    >
                        {title}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton size="large" onClick={handleUserMenu} color="inherit">
                            <AccountCircle sx={{ fontSize: 30 }} />
                        </IconButton>
                        <Menu
                            anchorEl={userMenuAnchor}
                            open={Boolean(userMenuAnchor)}
                            onClose={handleUserMenuClose}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            {userMenuItems.map((item) => (
                                <MenuItem onClick={handleUserMenuClose} sx={{ py: 1.2 }}>
                                    <Stack direction="row" alignItems="center" spacing={1.5}>
                                        {item.icon}
                                        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
                                        <Typography variant="inherit">{item.label}</Typography>
                                    </Stack>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>

            {!isMobile && (
                <Drawer
                    variant="permanent"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                            bgcolor: 'rgb(30 41 59 / var(--tw-bg-opacity, 1))',
                        },
                    }}
                >
                    {drawerContent}
                </Drawer>
            )}

            {isMobile && (
                <Drawer
                    variant="temporary"
                    open={mobileDrawerOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        '& .MuiDrawer-paper': {
                            width: mobileDrawerWidth,
                            boxSizing: 'border-box',
                            bgcolor: 'rgb(30 41 59 / var(--tw-bg-opacity, 1))',
                        },
                    }}
                >
                    {drawerContent}
                </Drawer>
            )}

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    bgcolor: blueGrey[50],
                    minHeight: '100vh',
                    p: { xs: 2, sm: 2.5, md: 3 },
                    boxSizing: 'border-box',
                    overflow: 'auto',
                }}
            >
                <Toolbar />
                <Box sx={{ maxWidth: '100%', mx: 'auto', pt: { xs: 1, md: 2 } }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

export default DashboardLayout;