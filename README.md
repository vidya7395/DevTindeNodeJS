# NodeJS


## //Review and response on the request
   
   POST - /request/review/:status/:requestId


## userRouter
- GET /user/feed - Gets you the profiles of other users on platform
   - Get me data of other users

//FEED Notes
/feed?page=1&limit=10 => first 10 users  skip(0) limit(10)
/feed?page=2&limit=10 => first 11-20 users skip(10) limit(10)
/feed?page=3&limit=10 => first 21-30  users skip(20) limit(10)

skip = ((page-1) * limit)


//Integration - https://razorpay.com/docs/payments/server-integration/nodejs/integration-steps/#1-build-integration
//Verify webhook - https://razorpay.com/docs/webhooks/validate-test/