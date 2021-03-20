import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Paper, Grid } from '@material-ui/core';

import StationSelect from './../StationSelect';

const useStyles = makeStyles((theme) => ({
    root: {
        paddingBottom: theme.spacing(3),
        paddingTop: theme.spacing(3),
        paddingLeft: theme.spacing(3)
    }
}));


const DataFilterBar = ({ onChangeStation, children, defaultValue }) => {
    const classes = useStyles();

    return (
        <Paper className={classes.root}>
            <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="center"
                spacing={3}
            >
                <Grid item xs={11} sm={6} md={5} lg={4}>
                    <StationSelect onChangeStation={onChangeStation} defaultValue={defaultValue}/>
                </Grid>
                {children}
            </Grid>
        </Paper>

    );
};

DataFilterBar.propTypes = {
    className: PropTypes.string
};


export default DataFilterBar;
