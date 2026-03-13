# E.R.A.S

This is an Expo/React Native application scaffold created with `expo-router`.  It includes custom theming and starter screens for authentication.

## Firebase Integration

Authentication and user storage are implemented using Firebase. To get started:

1. Create a Firebase project at https://console.firebase.google.com.
2. Add a new Web app and copy the configuration values.
3. Enable **Email/Password** sign-in under **Authentication > Sign-in method**.
4. Create a Firestore database (start in test mode for development).
5. Open `app/firebase.ts` and replace the `REPLACE_WITH_...` placeholders with your project's config.

## Local Setup

```sh
npm install        # or yarn install
# replace firebase config in `app/firebase.ts`
npm run web         # run web version
npm run ios         # run on iOS simulator/device
npm run android     # run on Android emulator/device
```

After the app is running, use the **Sign up** screen to create a user; it will automatically authenticate through Firebase and store a document in `users/{uid}` in Firestore.  The **Sign in** screen signs in an existing user.

## Notes

* No backend code is present; the Firebase SDK handles auth and persistence.
* You can navigate to `/homepage` post-auth via `router.replace('/homepage')`.
* Network errors or auth failures display inline messages on the forms.

### Sample Account

A built-in test account is available for convenience. In the sign-in screen tap **"Use sample account"** and the form will populate with credentials (`test@example.com` / `testing123`). The app will also attempt to create the account in Firebase if it doesn't already exist.


