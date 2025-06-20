from flask import Flask, render_template, request, jsonify
from twilio.rest import Client
import json

app = Flask(__name__)

# Twilio setup
account_sid = "your_twilio_sid"
auth_token = "your_twilio_token"
twilio_number = "+1XXXXXXXXXX"
client = Client(account_sid, auth_token)

def send_sms(to_number, message):
    client.messages.create(
        body=message,
        from_=twilio_number,
        to=to_number
    )

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/sos', methods=['POST'])
def sos():
    data = request.json
    user = data['user']
    lat = data['location']['lat']
    lng = data['location']['lng']
    
    with open('contacts.json') as f:
        contacts = json.load(f)

    message = f"🚨 SOS Alert for {user}! Location: https://maps.google.com/?q={lat},{lng}"
    for c in contacts:
        send_sms(c['phone'], message)

    return jsonify({'status': 'SOS sent'})

if __name__ == '__main__':
    app.run(debug=True)
