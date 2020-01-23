/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */

const regex = /{{\s*([^}]+)\s*}}/g;
var _pushVaribales = "";

function interpolate(messageData) {
    return function interpolate(o) {
        return messageData.replace(regex, function (a, b) {
            var r = o[b];
            return typeof r === 'string' || typeof r === 'number' ? r : a;
        });
    }
}

function createTemplateMessage(messageData) {
    if (Object.keys(_pushVaribales).length > 0 ) {
        var message = interpolate(messageData)(_pushVaribales);
        return message;
    } else {
        return messageData;
    }
}

function displayNotification(event) {
    var message = event.data.text();
    self.registration.showNotification(message);  
    return Promise.resolve();
}


function triggerSeenEvent(strMsg) {
    send_message_to_all_clients("msgEventSeen:" + strMsg);
}

function triggerOpenEvent(strMsg) {
    send_message_to_all_clients("msgEventOpen:" + strMsg);
}

function onPushNotificationReceived(event) {
    console.log('Push notification received : ', event);
    if (event.data) {
        console.log('Event data is : ', event.data.text());
    }
    event.waitUntil(displayNotification(event).then(() => triggerSeenEvent(event.data.text())));
};

self.addEventListener('push', onPushNotificationReceived);

function send_message_to_client(client, msg) {
    return new Promise(function (resolve, reject) {
        var msg_chan = new MessageChannel();

        msg_chan.port1.onmessage = function (event) {
            if (event.data.error) {
                reject(event.data.error);
            } else {
                resolve(event.data);
            }
        };

        client.postMessage(msg, [msg_chan.port2]);
    });
}

function send_message_to_all_clients(msg) {
    clients.matchAll().then(clients => {
        clients.forEach(client => {
            send_message_to_client(client, msg);
        });
    });
}

self.addEventListener('install', function (event) {
    self.skipWaiting();
    console.log('Installed Service Worker : ', event);
});

self.addEventListener('message', function (event) {
    replyPort = event.ports[0];
    _pushVaribales = event.data;
});

self.addEventListener('activate', function (event) {
    console.log('Activated Service Worker : ', event);
    event.waitUntil(self.clients.claim());
});

self.addEventListener('notificationclick', function (event) {
    console.log('Notification clicked with tag' + event.notification.tag + " and data " + event.notification.data);
    let nidjson = event.notification.data;
    event.notification.close();
    event.waitUntil(triggerOpenEvent(nidjson));
});

self.addEventListener('pushsubscriptionchange', function () {
    console.log('Push Subscription change');
    send_message_to_all_clients("updateRegistration:");
});