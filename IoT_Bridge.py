import cv2
import os
import sys
from ultralytics import YOLO
import firebase_admin
from firebase_admin import credentials, firestore

# 1. INITIALIZE FIREBASE
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# 2. SETUP YOLO (M2 GPU)
model = YOLO('best.pt').to('mps') 

# 3. CAMERA SETUP (Update this IP if DroidCam changes)
stream_url = "http://172.20.10.3:4747/video" 
cap = cv2.VideoCapture(stream_url)

print("✅ ERAS IoT Bridge Active...")
print("🔍 Monitoring feed for elephants...")

while True:
    ret, frame = cap.read()
    if not ret: 
        print("❌ Lost connection to DroidCam!")
        break

    # Lowered confidence to 0.5 for better detection reliability
    results = model(frame, conf=0.5, verbose=False)
    
    for r in results:
        for box in r.boxes:
            label = model.names[int(box.cls[0])]
            confidence = float(box.conf[0])
            
            # Print everything the AI sees to the terminal
            print(f"🕵️ AI sees: {label} ({confidence:.2f} confidence)")

            if label == 'elephant' and confidence >= 0.6:
                print("🚨 THRESHOLD MET! Sending Firebase Alert...")
                
                db.collection('alerts').add({
                    'status': 'active',
                    'location': 'Railway Sector 04',
                    'createdAt': firestore.SERVER_TIMESTAMP,
                    'device': 'IoT-Sensor-Phone-01',
                    'cameraId': 1,
                    'latitude': 6.9271,
                    'longitude': 80.7743,
                })
                cv2.waitKey(3000) # 3-second cooldown

    # Show the monitor window
    annotated_frame = results[0].plot()
    cv2.imshow("ERAS IoT Monitor", annotated_frame)
    
    if cv2.waitKey(1) & 0xFF == ord('q'): 
        break

cap.release()
cv2.destroyAllWindows()