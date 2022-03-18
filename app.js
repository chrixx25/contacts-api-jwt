require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.APP_PORT || 3000;
const UserRouter = require('./routers/user');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
}));

app.use('/contact/users', UserRouter);

app.listen(process.env.APP_PORT, () => {
    console.log(`Listening on port ${port}`);
});