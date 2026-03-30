import json
import os
import time
from urllib import error, request

import cv2
from ultralytics import YOLO


def post_json(url, payload):
    data = json.dumps(payload).encode("utf-8")
    req = request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with request.urlopen(req, timeout=10) as response:
        return json.loads(response.read().decode("utf-8"))


def patch_json(url, payload=None):
    data = json.dumps(payload or {}).encode("utf-8")
    req = request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json"},
        method="PATCH",
    )
    with request.urlopen(req, timeout=10) as response:
        return json.loads(response.read().decode("utf-8"))


# 1. Setup YOLO (M2 GPU)
model = YOLO("best.pt").to("mps")

# 2. Camera setup (update this IP if DroidCam changes)
stream_url = "http://10.31.23.176:4747/video"
cap = cv2.VideoCapture(stream_url)

backend_base_url = os.environ.get("ERAS_BACKEND_URL", "http://localhost:3000").rstrip("/")
alert_resolve_cooldown_seconds = float(os.environ.get("ERAS_ALERT_RESOLVE_DELAY", "5"))

print("✅ ERAS IoT Bridge Active...")
print("🔍 Monitoring feed for elephants...")
print(f"🌐 Backend API: {backend_base_url}")

active_alert_id = None
last_elephant_seen_at = None

while True:
    ret, frame = cap.read()
    if not ret:
        print("❌ Lost connection to DroidCam!")
        break

    results = model(frame, conf=0.5, verbose=False)
    elephant_detected = False

    for r in results:
        for box in r.boxes:
            label = model.names[int(box.cls[0])]
            confidence = float(box.conf[0])

            print(f"🕵️ AI sees: {label} ({confidence:.2f} confidence)")

            if label == "elephant" and confidence >= 0.6:
                elephant_detected = True
                last_elephant_seen_at = time.time()

                if active_alert_id is None:
                    print("🚨 Threshold met. Sending alert to backend...")
                    try:
                        response = post_json(
                            f"{backend_base_url}/detections/elephant",
                            {
                                "location": "Railway Sector 04",
                                "device": "IoT-Sensor-Phone-01",
                                "cameraId": 1,
                                "latitude": 6.9271,
                                "longitude": 80.7743,
                                "severity": "high",
                                "note": "Elephant detected by YOLO bridge",
                            },
                        )
                        active_alert_id = response.get("alertId")
                        print(f"✅ Alert created in backend: {active_alert_id}")
                    except (error.URLError, error.HTTPError, json.JSONDecodeError) as err:
                        print(f"❌ Failed to create alert in backend: {err}")
                break

        if elephant_detected:
            break

    if active_alert_id is not None and not elephant_detected and last_elephant_seen_at is not None:
        if time.time() - last_elephant_seen_at >= alert_resolve_cooldown_seconds:
            print("✅ Elephant no longer detected. Marking alert done...")
            try:
                patch_json(f"{backend_base_url}/alerts/{active_alert_id}/done")
                print("✅ Alert marked done in backend.")
            except (error.URLError, error.HTTPError, json.JSONDecodeError) as err:
                print(f"❌ Failed to mark alert done in backend: {err}")
            finally:
                active_alert_id = None
                last_elephant_seen_at = None

    annotated_frame = results[0].plot()
    cv2.imshow("ERAS IoT Monitor", annotated_frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()