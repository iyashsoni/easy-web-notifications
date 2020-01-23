/* eslint-disable no-extend-native no-undef */
export default class ChromeFirefoxPush {
    async requestPermissionAndGetToken(vapidAppServerKey) {
        let registration = window.pushReg;
        return new Promise((resolve, reject) => {
            registration.pushManager.getSubscription().then(
            function(subscription) {
                if (subscription) {
                getToken(subscription)
                    .then((data) => resolve(data))
                    .catch((err) => reject(err));
                } else {
                const applicationServerKey = urlB64ToUint8Array(vapidAppServerKey);
                registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: applicationServerKey
                }).then(function(subscription) {
                    getToken(subscription)
                    .then((data) => resolve(data))
                    .catch((err) => reject(err));
                }).catch(function(error) {
                    if (Notification.permission === 'denied') {
                    console.info('Permission for Notifications was denied');
                    } else {
                    console.error('Unable to subscribe to push.', error);
                    }
                    reject(error);
                });
                }
            }).catch(function(e) {
                console.error('Error thrown while subscribing from ' +
                'push messaging.', e);
                reject(e);
            });
        });
    }
}

/* Get subscription token */
function getToken(subscription) {
    var rawKey = subscription.getKey ? subscription.getKey('p256dh') : '';
    var key = rawKey ? btoa(String.fromCharCode.apply(null, new Uint8Array(rawKey))) : '';
    var rawAuthSecret = subscription.getKey ? subscription.getKey('auth') : '';
    var authSecret = rawAuthSecret ? btoa(String.fromCharCode.apply(null, new Uint8Array(rawAuthSecret))) : '';

    if (!isValidString(subscription.endpoint) || !isValidString(key) || !isValidString(authSecret)) {
        console.error("Error while getting token values");
        return Promise.reject("Error while getting token values");
    }
    var tokenValue = {
        "endpoint": subscription.endpoint,
        "userPublicKey": key,
        "userAuth": authSecret,
    };
    return Promise.resolve(tokenValue);
}

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function isValidString(stringValue) {
  return (stringValue !== undefined) && (stringValue !== null) && (stringValue.length > 0);
}