import cv2
import torch
from ultralytics import YOLO

# 1. Define the hardware 'brain'
device = "mps" if torch.backends.mps.is_available() else "cpu"

# 2. Load the model and explicitly set the task
model = YOLO("best.pt", task="detect")

# 3. Create the 'cap' variable (This removes the yellow underline!)
cap = cv2.VideoCapture(0)

print("ERAS System Active. Press 'q' to stop.")

while cap.isOpened():
    success, frame = cap.read()
    if not success:
        break

    # 4. Run detection with class filtering and high confidence
    # We use classes=0 to focus only on elephants
    results = model.predict(source=frame, stream=True, conf=0.75, device=device, verbose=False, classes=0)

    annotated_frame = frame
    
    for r in results:
        if len(r.boxes) > 0:
            for box in r.boxes:
                c = box.conf.item()
                # 5. Only show the box if confidence is above 80%
                if c > 0.80:
                    annotated_frame = r.plot()
                    print(f"!!! ALERT: ELEPHANT CONFIRMED ({c:.2f}) !!!")

    # 6. Show output
    cv2.imshow("ERAS MacBook Live Demo", annotated_frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

# Clean up
cap.release()
cv2.destroyAllWindows()