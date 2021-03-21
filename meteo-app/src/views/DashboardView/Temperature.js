import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography,
    colors,
    makeStyles
} from '@material-ui/core';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import Icon from '../../components/Icon';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100%'
    },
    avatar: {
        height: 56,
        width: 56
    },
    differenceDownIcon: {
        color: colors.red[900]
    },
    differenceDownValue: {
        color: colors.red[900],
        marginRight: theme.spacing(2)
    },
    differenceUpIcon: {
        color: colors.green[900]
    },
    differenceUpValue: {
        color: colors.green[900],
        marginRight: theme.spacing(2)
    },
}));

const Temperature = ({ className, title, current, reference, referenceInfo, icon, ...rest }) => {
    const classes = useStyles();

    const change = parseFloat(current) - parseFloat(reference);

    return (
        <Card
            className={clsx(classes.root, className)}
            {...rest}
        >
            <CardContent>
                <Grid
                    container
                    justify="space-between"
                    spacing={3}
                >
                    <Grid item>
                        <Typography
                            color="textSecondary"
                            gutterBottom
                            variant="h5"
                        >
                            {title}
                        </Typography>
                        <Typography
                            color="textPrimary"
                            variant="h3"
                        >
                            {parseFloat(current).toFixed(2)}&#730;C
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Icon src={icon} width="50" height="50" />
                    </Grid>
                </Grid>
                <Box
                    mt={2}
                    display="flex"
                    alignItems="center"
                >
                    {change > 0
                        ? <ArrowUpwardIcon className={classes.differenceUpIcon} />
                        : <ArrowDownwardIcon className={classes.differenceDownIcon} />
                    }
                    <Typography
                        className={change > 0 ? classes.differenceUpValue : classes.differenceDownValue}
                        variant="body2"
                    >
                        {change.toFixed(2)}&#730;C
                    </Typography>
                    <Typography
                        color="textSecondary"
                        variant="subtitle1"
                    >
                        {referenceInfo}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

Temperature.propTypes = {
    className: PropTypes.string
};

export default Temperature;
