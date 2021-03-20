import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { sortBy } from 'lodash';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles({
    container: {
        minHeight: 600,
        maxHeight: 600
    },
});

const DataTable = ({ rows, columns }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [sort, setSort] = React.useState({ key: 'none', isReverse: false });

    const handleSort = sortKey => {
        setSort({
            ...sort,
            key: sortKey,
            isReverse: sort.key == sortKey && !sort.isReverse
        });
        setPage(0);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const sortedRows = sort.isReverse 
        ? sortBy(rows, sort.key).reverse() 
        : sortBy(rows, sort.key);

    return (
        <>
            <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth, maxWidth: column.maxWidth }}
                                >
                                    <Button color="secondary" onClick={() => handleSort(column.id)}>
                                        {column.label}
                                    </Button>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                            return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={row.date}>
                                    {columns.map((column) => {
                                        const value = row[column.id];
                                        return (
                                            <TableCell key={column.id} align={column.align}>
                                                {column.format ? column.format(value) : value}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                nextIconButtonText={t('nextIconButtonText')}
                backIconButtonText={t('backIconButtonText')}
                labelRowsPerPage={t('labelRowsPerPage')}
            />
        </>
    );
};

export default DataTable;