const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const attendanceRoutes = require("./routes/attendanceRoutes");
const leaveRoutes = require("./routes/leaveRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    if (process.env.TEST_MODE === "true") {
        const rawUser = req.headers["x-test-user"];

        if (rawUser) {
            try {
                req.user = JSON.parse(rawUser);
            } catch (error) {
                req.user = null;
            }
        }
    }

    next();
});

app.use("/api/attendance", attendanceRoutes);
app.use("/api/leave", leaveRoutes);

app.get("/api/health", (req, res) => {
    res.json({
        status: "OK",
        message: "Dayflow backend is running"
    });
});

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Dayflow backend running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

if (require.main === module) {
    startServer();
}

module.exports = { app, startServer };