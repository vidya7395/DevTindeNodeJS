const cron = require("node-cron");
const { startOfDay, endOfDay, subDays } = require("date-fns");
const ConnectionRequestModel = require("../model/connectionRequest");
const sendEmail = require("./sendEmail")
//Run at everyday in the morning
cron.schedule("0 08 * * *", async () => {
    try {
        const yesterday = subDays((new Date()),1);
        const yesterdayStart = startOfDay(yesterday);
        const yesterdayEnd = endOfDay(yesterday);
        console.log("yesterday start, end", yesterday, yesterdayStart, yesterdayEnd);

        const pendingRequests = await ConnectionRequestModel.find({
            status: "interested",
            createdAt: {
                $gte: yesterdayStart,
                $lt: yesterdayEnd
            }
        }).populate("fromUserId  toUserId");
        console.log("PendingRequest",pendingRequests);
        
        const listOfEmail = [...new Set(pendingRequests.map(request => request.toUserId.emailId))];
        console.log("list", listOfEmail);
        //Sync way of sending a message - block way
        for (const emails of listOfEmail) {
            try {
                const res = await sendEmail.run("New Friend Request pending for", "There are too many friend request pending");
                console.log("Response",res);
                
            } catch (error) {
                console.log("Error", error);

            }
        }
        //Queueing or bulk Emailing
        //Do Batch processing
        // there is also a package known as Bee Queue, npm bullMQ 
        //Also amazon SES can handle this
    } catch (error) {
        console.log("Error",error);
        
    }
});