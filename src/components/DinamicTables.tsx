import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Paper,
    IconButton,
    Typography,
    CircularProgress,
    Box,
    Switch,
    Button,
    Stack,
} from '@mui/material';

const DynamicTable = ({
    columns, rows, rowsPerPage, page, handleChangePage, handleChangeRowsPerPage, totalRegistros, actions, loading, noRecordsToDisplay, pagination,
}) => {
    const columnWidth = `${100 / (columns.length + (actions.length > 0 ? 1 : 0))}%`;

    return (
        <Paper>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell key={column.id} style={{ width: columnWidth }}>
                                    {column.label}
                                </TableCell>
                            ))}
                            {actions.length > 0 && <TableCell style={{ width: columnWidth }} align='center'>Ações</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length + (actions.length > 0 ? 1 : 0)} align="center">
                                    <Box display="flex" justifyContent="center" alignItems="center">
                                        <CircularProgress />
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ) : rows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length + (actions.length > 0 ? 1 : 0)} align="center">
                                    <Typography variant="body1">{noRecordsToDisplay}</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            rows.map((row, index) => (
                                <TableRow key={index}>
                                    {columns.map((column) => (
                                        <TableCell key={column.key} style={{ width: columnWidth }}>
                                            {column.render
                                                ? column.render(row[column.key], row)
                                                : row[column.key]}
                                        </TableCell>
                                    ))}
                                    {actions.length > 0 &&
                                        <TableCell align='center' style={{ width: columnWidth }}>
                                            <Stack direction="row" spacing={0.5} justifyContent="center" flexWrap="wrap" alignItems="center">
                                                {actions.map((action, actionIndex) => (
                                                    action.shouldShowAction && action.shouldShowAction(row) ? (
                                                        action.type === 'switch' ? (
                                                            <Switch
                                                                key={actionIndex}
                                                                checked={action.checked ? action.checked(row) : false}
                                                                onChange={(e, checked) => action.onChange(row, checked)}
                                                                color={action.color || 'primary'}
                                                                size="small"
                                                                slotProps={{
                                                                    input: {
                                                                        'aria-label': action.label || 'switch-action'
                                                                    }
                                                                }}
                                                            />
                                                        ) : action.isTextOnly ? (
                                                            <Typography
                                                                key={actionIndex}
                                                                variant="caption"
                                                                color={typeof action.color === 'function' ? action.color(row) + '.main' : action.color + '.main'}
                                                                sx={{
                                                                    fontSize: '0.75rem',
                                                                    fontWeight: 500,
                                                                    fontStyle: 'italic'
                                                                }}
                                                            >
                                                                {typeof action.label === 'function' ? action.label(row) : action.label}
                                                            </Typography>
                                                        ) : action.showLabel !== false ? (
                                                            <Button
                                                                key={actionIndex}
                                                                variant="text"
                                                                size="small"
                                                                color={typeof action.color === 'function' ? action.color(row) : action.color || 'default'}
                                                                startIcon={action.icon}
                                                                onClick={() => action.onClick(row)}
                                                                sx={{
                                                                    minWidth: 'auto',
                                                                    fontSize: '0.75rem',
                                                                    padding: '2px 6px',
                                                                    textTransform: 'none',
                                                                    whiteSpace: 'nowrap'
                                                                }}
                                                            >
                                                                {typeof action.label === 'function' ? action.label(row) : action.label}
                                                            </Button>
                                                        ) : (
                                                            <IconButton
                                                                key={actionIndex}
                                                                onClick={() => action.onClick(row)}
                                                                color={typeof action.color === 'function' ? action.color(row) : action.color || 'default'}
                                                                title={typeof action.label === 'function' ? action.label(row) : action.label}
                                                                size="small"
                                                            >
                                                                {action.icon}
                                                            </IconButton>
                                                        )
                                                    ) : null
                                                ))}
                                            </Stack>
                                        </TableCell>
                                    }
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            {pagination && (
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={totalRegistros || rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            )}
        </Paper>
    );
};

export default DynamicTable;