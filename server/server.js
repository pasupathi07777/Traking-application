const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

app.use((req, res, next) => {
    console.log("Headers:", req.headers);
    console.log("Raw cookies:", req.headers.cookie);
    console.log("Parsed cookies:", req.cookies);
    next();
  });


app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
