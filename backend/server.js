require('dotenv').config();

const app = require("./src/app");
const connectDB = require("./src/db/db")
const { startCampaignScheduler } = require("./src/services/campaignScheduler")

connectDB()


app.listen(3000, () => {
    console.log("Backend server is running at port 3000");
    startCampaignScheduler();
})