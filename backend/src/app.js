const express = require('express');
const creatorRoutes = require("./routes/creator.routes")
const authRoutes = require("./routes/auth.routes");
const subscriberRoutes = require("./routes/subscriber.routes");
const campaignRoutes = require("./routes/campaign.routes")
const aiRoutes = require("./routes/ai.routes");

const app = express();

app.use(express.json());

app.use('/api/creator', creatorRoutes)
app.use("/api/auth", authRoutes)
app.use('/api/subscriber', subscriberRoutes)
app.use('/api/campaign', campaignRoutes)
app.use('/api/ai', aiRoutes)


app.get("/", (req, res) => {
    res.send("Welcome To Email Service");
})

app.get("/health", (req, res) => {
    res.json({
        success: true
    })
})


module.exports = app;