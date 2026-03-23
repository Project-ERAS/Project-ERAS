import cv2
from ultralytics import YOLO

model = YOLO('best.pt').to('mps')

stream_url = "http://172.20.12.2:4747/video"
print(f"Connecting to: {stream_url}")

cap = cv2.VideoCapture(stream_url)

if not cap.isOpened():
    print("❌ Could not connect. Make sure DroidCam is open and on same WiFi.")
    exit()

print("✅ iPhone camera connected!")
print("ERAS Live System Active... Press 'q' to stop.")

while True:
    ret, frame = cap.read()
    if not ret or frame is None:
        print("⚠️ Lost stream — retrying...")
        cap = cv2.VideoCapture(stream_url)
        continue

    results = model(frame, conf=0.25, verbose=False)
    annotated_frame = results[0].plot()

    cv2.imshow("ERAS - Elephant Detection", annotated_frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
