from flask import Flask, render_template, request, jsonify
from twilio.rest import Client
import os

app = Flask(__name__)

# Twilio setup
account_sid = "AC91c4df2979105fcf14ce5a446a12d31f"
auth_token = "ea09368bf232259933e94ea3038046c0"
twilio_number = "+12792057151"
emergency_contact = '+916395526762'

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/sos', methods=['POST'])
def sos():
    client = Client(account_sid, auth_token)
    message = client.messages.create(
        body="🚨 SOS Alert from SafeWalk!\nThis person needs help immediately!",
        from_=twilio_phone,
        to=emergency_contact
    )
    return "SOS alert sent! You'll receive a message shortly."

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=81)
