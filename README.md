# easy-web-notifications for Chrome and Firefox

This is a easy to use plugin that will help you save some time in implementing Web Push Notifications in your Client Apps. 


### Installation:

`npm install easy-web-notifications`

### Setup:

Copy the file `PushServiceWorker.js` from the plugin directory (./node_modules/easy-web-notifications/) to your public assets directory in your Web App. This file is basically a listener for the incoming notification events.

Then add the following lines to your `index.html` under `<head>` tag. (Make sure to edit )

```
<script>
    if (navigator.serviceWorker) { 
        navigator.serviceWorker.register('<PATH_TO_YOUR_PUBLIC_ASSETS_DIRECTORY>/PushServiceWorker.js')
        .then(function(reg) {
            window.pushReg = reg;
            if (reg.installing) {
                console.info('Service worker installing');
            } else if (reg.waiting) {
                console.info('Service worker installed');
            } else if (reg.active) {
                console.info('Service worker active');
            }
            if (!(reg.showNotification)) {
                console.info('Notifications aren\'t supported on service workers.');
            }
            // Check if push messaging is supported
            if (!('PushManager' in window)) {
                console.info("Push messaging isn't supported.");
            }

            if (Notification.permission === 'denied') {
                console.info('The user has blocked notifications.');
            }
        }).catch(err => {
            console.error(JSON.stringify(err));
        });
    } else {
        console.info("Service workers aren't supported in this browser.");
    }
</script>
```

Next, create a file named `manifest.json` in the same directory where you copied `PushServiceWorker.js`. Copy/Paste the following content into it:

```
{ "name": "<APP-NAME>", "gcm_sender_id": "<YOUR-FCM-SENDER-ID-HERE>" }
```
This file is required for sending notifications to Chrome from FCM. Now, link the file to `index.html` as follows:

```
<link rel="manifest" href="<PATH_TO_YOUR_PUBLIC_ASSETS_DIRECTORY>/manifest.json">
```
That's it, you're all set to use the SDK.

--- 
This plugin will automatically take care of asking permission to the User for allowing Notification and will also return a Subscription token in case the User has allowed to be notified - all of this in just 1 API call.

All you need to do is call - `Push.requestPermissionAndGetToken(VAPID_PUBLIC_KEY)`;

---

### What is this VAPID?

Voluntary Application Server Identification for Web Push (VAPID) protocol. Chrome browser clearly states that 
`Only VAPID keys will be supported in the future.` 

To simplify for current understanding, VAPID keys (public and private) are a set of keys to authenticate the communication between desired Push Client (Web Push App) and designated Push Server (Web Push enabled Backend Server). 

Check this online VAPID keys generator to get your own set of keys: [Click me!](https://tools.reactpwa.com/vapid)

*Note* - We just need Public VAPID key on the Client App, but we will need both Public and Private VAPID keys for server side implementation.

---

### Usage:

```
import Push from 'easy-web-notifications';
...
...

const applicationServerPublicKey = "<YOUR_VAPID_PUBLIC_KEY>";
Push.requestPermissionAndGetToken(applicationServerPublicKey).then(res => {
    console.log("Successfully Registered for Push. Token is : \n" + JSON.stringify(res));
}).catch(err => {
    console.log("Push Registration Failed" + err);
});

```

---

For any issues, please open a task [here](https://github.com/iyashsoni/easy-web-notifications/issues).