const { admin }  =  require('./setupNotifications');
const {logger } =  require('../logger/logger');

const notification_options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
};

// let registrationToken = 'fIBLZdrIShK3KPpfVZ9h6b:APA91bEu_ZJI28A-T6ZEL73JEPYk3-S_Kb6cVn-rXcqhNjS_RabbunID0Kyj1l8aV9c-fVp6JADZy-novTAv5XNGP0pSnr8qkfWXX4fJRYBH5qVVgCLbD2x160sgJQFihbbGz5RoAMjT'
// var message_notification = {
//     data: {
//         Mykey: "Hello"
//     }
// }
// console.log("admin",admin)
exports.notifications = async (registrationToken, message_notification) => {
    message_notification.notification.sound = "default"
    logger.info(JSON.stringify({ EVENT: "NOTIFICATION_DATA", message_notification }))
    await admin.messaging().sendToDevice(registrationToken, message_notification, notification_options )
        .then(response => {
            logger.info(JSON.stringify({ EVENT: "NOTIFICATION", RESULT: "NOTIFICATION SENT SUCCESSFULLY", RESPONSE: response }))
        })
        .catch(error => {
            console.log("error:", error);
            logger.error(JSON.stringify({ EVENT: "NOTIFICATION", RESULT: "NOTIFICATION NOT SENT", ERROR: error }))
        })
}
exports.sendNotificationToAll = async(tokens, message_notification) => {
    message_notification.notification.sound = "default"
    logger.info(JSON.stringify({ EVENT: "NOTIFICATION_DATA", message_notification }))
    await admin.messaging().sendMulticast(tokens, message_notification, notification_options)
        .then(response => {
            logger.info(JSON.stringify({ EVENT: "NOTIFICATION", RESULT: "NOTIFICATION SENT SUCCESSFULLY", RESPONSE: response.successCount }))
        })
        .catch(error => {
            logger.error(JSON.stringify({ EVENT: "NOTIFICATION", RESULT: "NOTIFICATION NOT SENT", ERROR: error }))
        })
}