from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from secure_steg_crypto_full import (
    hide_image_flow, extract_image_flow,
    hide_audio_flow, extract_audio_flow,
    extract_bytes_from_image, extract_bytes_from_wav,
    decrypt_message_from_payload
)
import tempfile
import os

app = Flask(__name__)
CORS(app)

@app.route("/hide_image", methods=["POST"])
def hide_image():
    if "cover_file" not in request.files or "message" not in request.form or "password" not in request.form:
        return jsonify({"error": "Missing required fields"}), 400

    cover_file = request.files["cover_file"]
    message = request.form["message"]
    password = request.form["password"]

    with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as temp:
        cover_file.save(temp.name)
        temp_path = temp.name

    out_path = tempfile.mktemp(suffix=".png")
    hide_image_flow(temp_path, out_path, message, password)

    return send_file(out_path, as_attachment=True, download_name="stego.png")

@app.route("/extract_image", methods=["POST"])
def extract_image():
    if "stego_file" not in request.files or "password" not in request.form:
        return jsonify({"error": "Missing required fields"}), 400

    stego_file = request.files["stego_file"]
    password = request.form["password"]

    with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as temp:
        stego_file.save(temp.name)
        temp_path = temp.name

    payload = extract_bytes_from_image(temp_path)
    try:
        msg = decrypt_message_from_payload(payload, password)
        return jsonify({"message": msg})
    except Exception as e:
        return jsonify({"error": f"Decryption failed: {e}"}), 500

@app.route("/hide_audio", methods=["POST"])
def hide_audio():
    if "cover_audio" not in request.files or "message" not in request.form or "password" not in request.form:
        return jsonify({"error": "Missing required fields"}), 400

    cover_audio = request.files["cover_audio"]
    message = request.form["message"]
    password = request.form["password"]

    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp:
        cover_audio.save(temp.name)
        temp_path = temp.name

    out_path = tempfile.mktemp(suffix=".wav")
    hide_audio_flow(temp_path, out_path, message, password)

    return send_file(out_path, as_attachment=True, download_name="stego.wav")

@app.route("/extract_audio", methods=["POST"])
def extract_audio():
    if "stego_audio" not in request.files or "password" not in request.form:
        return jsonify({"error": "Missing required fields"}), 400

    stego_audio = request.files["stego_audio"]
    password = request.form["password"]

    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp:
        stego_audio.save(temp.name)
        temp_path = temp.name

    payload = extract_bytes_from_wav(temp_path)
    try:
        msg = decrypt_message_from_payload(payload, password)
        return jsonify({"message": msg})
    except Exception as e:
        return jsonify({"error": f"Decryption failed: {e}"}), 500

if __name__ == "__main__":
    app.run(debug=True)
