import { useColorScheme } from '@mui/material/styles';

const AppBranding = () => {
    const { mode } = useColorScheme();

    const logoColor = mode === 'light' ? '#005E46' : '#005E46';

    return {
        logo: (
            <div
                style={{
                    color: logoColor,
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                }}
            >
                <i className="fas fa-shield-alt fa-2x" />
                <span>BAS Saúde</span>
            </div>
        ),
        title: '',
        homeUrl: '/toolpad/core/introduction',
    };
};

export default AppBranding;