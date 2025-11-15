# Secure Multimedia Data Hiding

## Requirements
pip install -r requirements.txt

## Examples
# Hide in image
python secure_steg_crypto_full.py hide_image -i cover.png -o stego.png -m "secret" -p "mypassword"

# Extract from image
python secure_steg_crypto_full.py extract_image -i stego.png -p "mypassword"

# Hide in audio
python secure_steg_crypto_full.py hide_audio -i cover.wav -o stego.wav -m "secret" -p "mypassword"

# Extract from audio
python secure_steg_crypto_full.py extract_audio -i stego.wav -p "mypassword"
