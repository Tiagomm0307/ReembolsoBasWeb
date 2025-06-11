// App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import LoginPage from './pages/LoginPage';
import HRManagerDashboard from './pages/HRManagerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import EmployeeDashboard from './pages/EmployeeDashboard';
import { CssBaseline } from '@mui/material';
import RHDashboard from './pages/RHDashboard';
import { SnackbarProvider } from 'contexts/SnackbarContext';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

dayjs.locale('pt-br'); // define globalmente

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
        <AuthProvider>
          <SnackbarProvider>
            <CssBaseline />
            <Router>
              <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />

                {/* Rotas protegidas para cada perfil */}
                <Route
                  path="/empregado/*"
                  element={
                    <ProtectedRoute allowedRoles={['empregado']}>
                      <EmployeeDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/rh/*"
                  element={
                    <ProtectedRoute allowedRoles={['rh']}>
                      <RHDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/gerente_rh/*"
                  element={
                    <ProtectedRoute allowedRoles={['gerente_rh']}>
                      <HRManagerDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/*"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Router>
          </SnackbarProvider>
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  )
};


export default App;
