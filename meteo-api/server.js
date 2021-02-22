const app = require('./app');

const port = process.env.PORT || 8090;
app.listen(port, () => {
    console.log(`Application is running on port ${port}`);
});