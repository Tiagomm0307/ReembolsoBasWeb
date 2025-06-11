import React, { useState } from 'react';
import { IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { ValidaReembolsoProps } from 'pages/RHDashboard/pages/ValidarReembolsos';

type ActionMenuProps = {
    actions: Action[];
    row: ValidaReembolsoProps;
};

type Action = {
    label: string;
    icon: React.ReactNode;
    onClick: (row: ValidaReembolsoProps) => void;
    shouldShowAction?: (row: ValidaReembolsoProps) => boolean;
};

export function ActionMenu({ actions, row }: ActionMenuProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const visibleActions = actions.filter(
        (action) => (action.shouldShowAction ? action.shouldShowAction(row) : true)
    );

    if (visibleActions.length === 0) {
        return null;
    }

    return (
        <>
            <IconButton onClick={handleOpen}>
                <MoreVert />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {visibleActions.map((action, index) => (
                    <MenuItem
                        key={index}
                        onClick={() => {
                            action.onClick(row);
                            handleClose();
                        }}
                    >
                        {action.icon}
                        <Typography sx={{ ml: 1 }}>{action.label}</Typography>
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
}
