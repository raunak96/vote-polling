const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();

require("dotenv").config();

const poll = require("./routes/poll");

// Set public folder
app.use(express.static(path.join(__dirname, "public")));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable CORS
app.use(cors());

require("./db")();

app.use("/poll", poll);

const port = 3001;

// Start server
app.listen(port, () => console.log(`Server started on port ${port}`));
