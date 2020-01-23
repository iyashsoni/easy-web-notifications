# easy-web-notifications for Chrome and Firefox

This is a easy to use plugin that will help you save some time in implementing Web Push Notifications in your Client Apps. 

This plugin will automatically take care of asking permission to the User for allowing Notification and will also return a Subscription token in case the User has allowed to be notified - all of this in just 1 API call.

All you need to do is call - `Push.requestPermissionAndGetToken(VAPID_PUBLIC_KEY)`;

---

What is this VAPID?

Voluntary Application Server Identification for Web Push (VAPID) protocol. Chrome browser clearly states that 
`Only VAPID keys will be supported in the future.` 

To simplify for current understanding, VAPID keys (public and private) are a set of keys to authenticate the communication between desired Push Client (Web Push App) and designated Push Server (Web Push enabled Backend Server). 

Check this online VAPID keys generator to get your own set: https://tools.reactpwa.com/vapid

---

*Note* - We just need Public VAPID key on the Client App, but we will need both Public and Private VAPID keys for server side implementation.