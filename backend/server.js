const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/departments", require("./routes/departmentRoutes"));
app.use("/api/programmes", require("./routes/programmeRoutes"));
app.use("/api/blocks", require("./routes/blockRoutes"));
app.use("/api/rooms", require("./routes/roomRoutes"));
app.use("/api/roles", require("./routes/roleRoutes"));
app.use("/api/complaints", require("./routes/complaintRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});