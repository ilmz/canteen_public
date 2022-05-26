const { admin }  =  require('./setupNotifications');
const {logger } =  require('../logger/logger');

const notification_options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
};
// console.log("admin",admin)
exports.notifications = async (registrationToken, message_notification) => {
    message_notification.notification.sound = "default"
    logger.info(JSON.stringify({ EVENT: "NOTIFICATION_DATA", message_notification }))
    await admin.messaging().sendToDevice(registrationToken, message_notification, notification_options)
        .then(response => {
            logger.info(JSON.stringify({ EVENT: "NOTIFICATION", RESULT: "NOTIFICATION SENT SUCCESSFULLY", RESPONSE: response.successCount }))
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