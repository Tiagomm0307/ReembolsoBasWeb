import type { ReactNode } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Tooltip,
  AppBar,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import { useNavigate } from 'react-router-dom';

interface CustomAppBarProps {
  title: string;
  children?: ReactNode;
}

const CustomAppBar: React.FC<CustomAppBarProps> = ({ title, children }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <AppBar position="static" color="default" elevation={1}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton edge="start" color="primary" onClick={handleBack}>
            <ArrowBackIcon />
          </IconButton>

          <Typography variant="h6" color="primary" fontWeight="bold">
            {title}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Aumentar Fonte">
            <IconButton color="primary">
              <ZoomInIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Diminuir Fonte">
            <IconButton color="primary">
              <ZoomOutIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Alto Contraste">
            <IconButton color="primary">
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </AppBar>

      <Box>{children}</Box>
    </Box>
  );
};

export default CustomAppBar;
