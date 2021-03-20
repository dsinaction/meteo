import React from 'react';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
    container: {
        minHeight: 600,
        maxHeight: 600
    }
}));

const StationsTable = ({ className, stations }) => {
    const classes = useStyles();
    const { t } = useTranslation();

    return (
        <TableContainer className={classes.container}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell><strong>{t('Station Name')}</strong></TableCell>
                        <TableCell><strong>{t('Latest Observation')}</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {stations.map(station => (
                        <TableRow>
                            <TableCell>{station.name}</TableCell>
                            <TableCell>{moment(station.synop_max_date).format('YYYY-MM-DD')}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default StationsTable;