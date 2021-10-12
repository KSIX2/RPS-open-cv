import cv2 as cv
import mediapipe as mp
from flask import Flask, render_template, Response, jsonify

humanMove = "nothing"
app = Flask(__name__)

mphands = mp.solutions.hands
hands = mphands.Hands(min_detection_confidence = 0.6, min_tracking_confidence = 0.6, max_num_hands = 1)
mpdraw = mp.solutions.drawing_utils

camera = cv.VideoCapture(0)
def gen_frames():  
    global humanMove
    while True:
        handldms = []
        success, frame = camera.read()
        RGBframe = cv.cvtColor(frame, cv.COLOR_BGR2RGB)
        results = hands.process(RGBframe)    
        if results.multi_hand_landmarks:
            for hand in results.multi_hand_landmarks:
                mpdraw.draw_landmarks(frame, hand, mphands.HAND_CONNECTIONS)
                for id, ldms in enumerate(hand.landmark):
                    handldms.append([id, ldms.x, ldms.y])
                else:
                    if(handldms[8][2] > handldms[5][2] and handldms[12][2] > handldms[9][2] and handldms[16][2] > handldms[13][2] and handldms[20][2] > handldms[17][2] and handldms[4][1] < handldms[3][1]):
                        humanMove = "rock"
                    elif(handldms[16][2] > handldms[13][2] and handldms[20][2] > handldms[17][2] and handldms[4][1] < handldms[3][1] and handldms[8][2] < handldms[5][2] and handldms[12][2] < handldms[9][2]):
                        humanMove = "scissor"
                    elif(handldms[8][2] < handldms[5][2] and handldms[12][2] < handldms[9][2] and handldms[16][2] < handldms[13][2] and handldms[20][2] < handldms[17][2] and handldms[4][1] > handldms[3][1]):
                        humanMove = "paper"
                    else:
                        humanMove = "invalid move"
        else: 
            humanMove = "No move made"
        if not success:
            break
        else:
            ret, buffer = cv.imencode('.jpg', cv.flip(frame, 1))
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route("/")
def index():
    return render_template("home.html", Move = humanMove)

@app.route("/game")
def game():
    return render_template("game.html", Move = humanMove)

@app.route("/gamegestureAPI")
def gamegesture():
    return jsonify(humanMove)

@app.route("/play")
def video_feed():
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

app.run(debug=True)