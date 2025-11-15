import streamlit as st
from secure_steg_crypto_full import (
    hide_image_flow, extract_image_flow,
    hide_audio_flow, extract_audio_flow,
    extract_bytes_from_image, extract_bytes_from_wav,
    decrypt_message_from_payload
)
import tempfile

# -------------------- Streamlit Page Setup --------------------
st.set_page_config(page_title="🔒 Secure StegoCrypt", layout="wide")

st.title("🔒 Secure StegoCrypt")
st.markdown("### Hide or Extract Encrypted Messages in Images or Audio Files")

# -------------------- UI Controls --------------------
mode = st.radio("Choose Mode", ["🖼️ Image", "🎵 Audio"], horizontal=True)
action = st.radio("Choose Action", ["Hide Message", "Extract Message"], horizontal=True)
password = st.text_input("Enter Password", type="password")

# -------------------- IMAGE MODE --------------------
if mode == "🖼️ Image":
    if action == "Hide Message":
        st.subheader("📥 Hide Message in Image")
        cover_file = st.file_uploader("Upload Cover Image (PNG/BMP)", type=["png", "bmp"])
        message = st.text_area("Enter Secret Message")

        if st.button("🔐 Hide Message"):
            if not (cover_file and message and password):
                st.warning("Please provide all fields.")
            else:
                with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as temp:
                    temp.write(cover_file.read())
                    temp_path = temp.name

                out_path = tempfile.mktemp(suffix=".png")
                hide_image_flow(temp_path, out_path, message, password)
                st.success("✅ Message embedded successfully!")

                with open(out_path, "rb") as f:
                    st.download_button("⬇️ Download Stego Image", f, file_name="stego.png")

    else:
        st.subheader("📤 Extract Message from Image")
        stego_file = st.file_uploader("Upload Stego Image", type=["png", "bmp"])

        if st.button("🔓 Extract Message"):
            if not (stego_file and password):
                st.warning("Please provide file and password.")
            else:
                with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as temp:
                    temp.write(stego_file.read())
                    temp_path = temp.name

                payload = extract_bytes_from_image(temp_path)
                try:
                    msg = decrypt_message_from_payload(payload, password)
                    st.success("✅ Message Extracted Successfully")
                    st.code(msg)
                except Exception as e:
                    st.error(f"❌ Decryption failed: {e}")

# -------------------- AUDIO MODE --------------------
elif mode == "🎵 Audio":
    if action == "Hide Message":
        st.subheader("📥 Hide Message in Audio")
        cover_audio = st.file_uploader("Upload WAV File (16-bit PCM)", type=["wav"])
        message = st.text_area("Enter Secret Message")

        if st.button("🔐 Hide Message"):
            if not (cover_audio and message and password):
                st.warning("Please provide all fields.")
            else:
                with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp:
                    temp.write(cover_audio.read())
                    temp_path = temp.name

                out_path = tempfile.mktemp(suffix=".wav")
                hide_audio_flow(temp_path, out_path, message, password)
                st.success("✅ Message embedded successfully!")

                with open(out_path, "rb") as f:
                    st.download_button("⬇️ Download Stego Audio", f, file_name="stego.wav")

    else:
        st.subheader("📤 Extract Message from Audio")
        stego_audio = st.file_uploader("Upload Stego Audio (WAV)", type=["wav"])

        if st.button("🔓 Extract Message"):
            if not (stego_audio and password):
                st.warning("Please provide file and password.")
            else:
                with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp:
                    temp.write(stego_audio.read())
                    temp_path = temp.name

                payload = extract_bytes_from_wav(temp_path)
                try:
                    msg = decrypt_message_from_payload(payload, password)
                    st.success("✅ Message Extracted Successfully")
                    st.code(msg)
                except Exception as e:
                    st.error(f"❌ Decryption failed: {e}")
