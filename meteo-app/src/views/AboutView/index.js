import React from 'react';
import { Container, makeStyles, Grid, Typography, Box, Card, CardContent, Link } from '@material-ui/core';
import Page from './../../components/Page';
import { useTranslation } from 'react-i18next';


const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        minHeight: '100%',
        paddingBottom: theme.spacing(3),
        paddingTop: theme.spacing(3)
    }
}));

const AboutView = () => {
    const classes = useStyles();
    const { t } = useTranslation();


    return (
        <Page className={classes.root} title={t('AboutView Title')}>
            <Container maxWidth="lg">
                <Grid container spacing={3}>
                    <Grid item lg={12} md={12} xs={12}>
                        <Card>
                            <CardContent>
                                <Box
                                    alignItems="right"
                                    display="flex"
                                    flexDirection="column"
                                >

                                    <Typography
                                        color="textPrimary"
                                        gutterBottom
                                        variant="h3"
                                    >
                                        {t('Data Source Header')}
                                    </Typography>
                                    <Typography color="textSecondary" variant="body1">
                                        {t('Data Source Info')}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item lg={12} md={12} xs={12}>
                        <Card>
                            <CardContent>
                                <Box
                                    alignItems="right"
                                    display="flex"
                                    flexDirection="column"
                                >
                                    <Typography
                                        color="textPrimary"
                                        gutterBottom
                                        variant="h3"
                                    >
                                        {t('Kontak')}
                                    </Typography>
                                    <Typography
                                        color="textSecondary"
                                        gutterBottom
                                        variant="h4"
                                    >
                                        <Link href="https://dsinaction.pl/" target="_blank" rel="noreferrer">
                                            Data Science In Action
                                        </Link>
                                    </Typography>
                                    <Typography color="textSecondary" variant="body1">
                                        {t('admin@dsinaction.pl')}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Page >
    );
};

export default AboutView;