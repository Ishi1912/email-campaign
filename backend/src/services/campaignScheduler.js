const cron = require("node-cron");
const campaignModel = require("../models/campaign.model");
const subscriberModel = require("../models/subscriber.model");
const emailService = require("./email.service");

function startCampaignScheduler() {

    cron.schedule("* * * * *", async () => {

        try {

            const campaigns = await campaignModel.find({
                status: "scheduled",
                scheduledAt: {
                    $lte: new Date()
                }
            });


            for (const campaign of campaigns) {

                console.log(
                    `Sending scheduled campaign: ${campaign.subject}`
                );

                campaign.status = "sending";
                await campaign.save();

                const subscribers = await subscriberModel.find({
                    creatorId: campaign.creatorId,
                    status: "active"
                });

                if (subscribers.length === 0) {

                    campaign.status = "failed";
                    await campaign.save();

                    console.log(
                        `No active subscribers for campaign ${campaign._id}`
                    );

                    continue;
                }

                let successCount = 0;
                let failedCount = 0;

                for (const subscriber of subscribers) {

                    try {

                        await emailService.sendEmail(
                            subscriber.email,
                            campaign.subject,
                            campaign.content
                        );

                        successCount++;

                    } catch (error) {

                        failedCount++;

                        console.error(
                            `Failed to send email to ${subscriber.email}:`,
                            error.message
                        );
                    }
                }

                if (successCount > 0) {

                    campaign.status = "sent";
                    campaign.sentAt = new Date();

                } else {

                    campaign.status = "failed";
                }

                await campaign.save();

                console.log(
                    `Campaign ${campaign._id} completed. ` +
                    `Sent: ${successCount}, Failed: ${failedCount}`
                );
            }

        } catch (error) {

            console.error(
                "Campaign scheduler error:",
                error.message
            );
        }
    });

    console.log("Campaign scheduler started");
}

module.exports = {
    startCampaignScheduler
};