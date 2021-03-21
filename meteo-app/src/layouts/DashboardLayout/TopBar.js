import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
    AppBar,
    Box,
    Hidden,
    IconButton,
    Toolbar,
    Typography,
    makeStyles
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import Logo from './../../components/Logo';

const useStyles = makeStyles(() => ({
    root: {
        backgroundColor: '#9EB9F3'
    },
    title: {
        flexGrow: 1
    },
}));

const TopBar = ({
    className,
    onMobileNavOpen,
    ...rest
}) => {
    const classes = useStyles();

    return (
        <AppBar
            className={clsx(classes.root, className)}
            elevation={0}
            {...rest}
        >
            <Toolbar>
                <RouterLink to="/">
                    <Logo width="60" height="60" />
                </RouterLink>
                <Typography variant="h2" className={classes.title}>
                    &nbsp;Meteo - Data Science In Action
                </Typography>
                <Box flexGrow={1} />
                <Hidden lgUp>
                    <IconButton
                        color="inherit"
                        onClick={onMobileNavOpen}
                    >
                        <MenuIcon />
                    </IconButton>
                </Hidden>
            </Toolbar>
        </AppBar>
    );
};

TopBar.propTypes = {
    className: PropTypes.string,
    onMobileNavOpen: PropTypes.func
};

export default TopBar;
