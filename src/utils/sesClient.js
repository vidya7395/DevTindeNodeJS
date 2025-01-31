const {SESClient} = require("@aws-sdk/client-ses");
// Set the AWS Region.
const REGION = "ap-south-1";


// Create SES service object.
const sesClient = new SESClient(
    { 
        region: REGION,
        credentials:{
            accessKeyId: process.env.AWS_SES_ACCESS,
            secretAccessKey: process.env.AWS_SES_SECRET
        }
     },
    );
module.exports = { sesClient };