import cv2
from ultralytics import YOLO

# 1. Load your model and use the Mac GPU (MPS)
model = YOLO('best.pt').to('mps') 

# 2. Open the MacBook FaceTime Camera (0 is the default camera)
cap = cv2.VideoCapture(0)

print("Starting Camera... Press 'q' to stop.")

while cap.isOpened():
    success, frame = cap.read()
    if not success:
        break

    # 3. Run YOLO detection on the live frame
    results = model(frame)

    # 4. Draw the boxes on the live video
    annotated_frame = results[0].plot()

    # 5. Display the window
    cv2.imshow("Real-Time Elephant Detection", annotated_frame)

    # Break the loop if 'q' is pressed
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()