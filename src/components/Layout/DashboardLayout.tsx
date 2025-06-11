import React from 'react';
import type { ReactNode } from 'react';
import { AppProvider, type Session } from '@toolpad/core/AppProvider';
import { DashboardLayout as ToolpadDashboardLayout } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';
import { AppNavigation } from './AppNavigation';
import { AppTheme } from './AppTheme';

interface LayoutProps {
    children: ReactNode;
}

export const DashboardLayout = ({ children }: LayoutProps) => {
    const router = useDemoRouter('/employee');
    const [session, setSession] = React.useState<Session | null>({
        user: {
            name: 'Bharat Kashyap',
            email: 'bharatkashyap@outlook.com',
            image: 'https://avatars.githubusercontent.com/u/19550456',
        },
    });

    const authentication = React.useMemo(() => {
        return {
            signIn: () => {
                setSession({
                    user: {
                        name: 'Bharat Kashyap',
                        email: 'bharatkashyap@outlook.com',
                        image: 'https://avatars.githubusercontent.com/u/19550456',
                    },
                });
            },
            signOut: () => {
                setSession(null);
            },
        };
    }, []);

    return (
        <AppProvider
            navigation={AppNavigation}
            router={router}
            theme={AppTheme}
            session={session}
            authentication={authentication}
            branding={{
                logo: (
                    <div
                        style={{
                            color: 'rgb(37 99 235)',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                        }}
                    >
                        <i className="fas fa-shield-alt fa-2x" />
                    </div>
                ),
                title: 'BAS Saúde',
                homeUrl: '/toolpad/core/introduction',
            }}
        >
            <ToolpadDashboardLayout>{children}</ToolpadDashboardLayout>
        </AppProvider>
    );
};
