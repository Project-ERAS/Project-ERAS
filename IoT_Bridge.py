import cv2
from ultralytics import YOLO
import firebase_admin
from firebase_admin import credentials, firestore

# 1. INITIALIZE FIREBASE
# Use the path to the file you just stored in the root
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# 2. SETUP YOLO & CAMERA
model = YOLO('assets/ERAS FINAL Camera/best.pt').to('mps') # Using Mac M2 GPU
stream_url = "http://10.31.9.132:4747/video" # Change to your friend's IP
cap = cv2.VideoCapture(stream_url)

print("✅ ERAS IoT Bridge Active...")

while True:
    ret, frame = cap.read()
    if not ret: break

    results = model(frame, conf=0.8, verbose=False)
    
    # 3. DETECTION LOGIC
    if len(results[0].boxes) > 0:
        for box in results[0].boxes:
            label = model.names[int(box.cls[0])]
            if label == 'elephant':
                print("🚨 ELEPHANT DETECTED! Sending alert to App...")
                
                # Push alert to Firestore
                db.collection('alerts').add({
                    'status': 'active',
                    'location': 'Railway Sector 04', # Demo location
                    'timestamp': firestore.SERVER_TIMESTAMP,
                    'device': 'IoT-Sensor-Phone-01'
                })
                
                # Wait a bit so you don't spam 100 alerts per second
                cv2.waitKey(2000) 

    # Show the monitor window on your Mac
    annotated_frame = results[0].plot()
    cv2.imshow("ERAS IoT Monitor", annotated_frame)
    if cv2.waitKey(1) & 0xFF == ord('q'): break

cap.release()
cv2.destroyAllWindows()