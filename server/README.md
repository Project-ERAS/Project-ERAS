# ERAS Node Backend

This folder contains a small Express backend that writes and updates Firestore alerts for the E.R.A.S app.

## Endpoints

- `GET /health` - health check
- `GET /alerts/latest` - latest alert
- `GET /alerts/:id` - single alert
- `GET /alerts` - list alerts
- `POST /alerts` - create an alert
- `POST /detections/elephant` - create an active elephant alert
- `PATCH /alerts/:id/done` - mark an alert as done
- `POST /alerts/:id/done` - alias for marking an alert done

## Local Setup

```sh
cd server
npm install
cp .env.example .env
npm start
```

## Environment Variables

- `PORT` - backend port, default `3000`
- `CORS_ORIGIN` - allowed web origin, default `*`
- `FIREBASE_SERVICE_ACCOUNT_JSON` - full service account JSON as one string
- `FIREBASE_SERVICE_ACCOUNT_PATH` - path to a service account JSON file

## Render Setup

- Root directory: `server`
- Build command: none
- Start command: `npm start`
- Add the Firebase service account as `FIREBASE_SERVICE_ACCOUNT_JSON` or `FIREBASE_SERVICE_ACCOUNT_PATH`
- Set `CORS_ORIGIN` to your app URL

## Notes

The app already listens to Firestore for live alerts, so this backend only needs to write or update Firestore documents.
