require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const UserRouter = require('./routers/user');

app.use(express.json());
app.use('/contact/users', UserRouter);

app.listen(process.env.APP_PORT, () => {
    console.log(`Listening on port ${port}`);
});