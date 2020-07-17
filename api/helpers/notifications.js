const crypto = require('crypto-js');
const dbInterface = require('./dbInterface');

async function createNotification(userId, notificationText, author = null) {
    const response = await dbInterface.createNotification(userId, notificationText, author);
    return `Notification created ${response}`;
}

async function markNotificationAsRead(notificationId) {

}

module.exports = {
    createNotification,
    markNotificationAsRead
}
