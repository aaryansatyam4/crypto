#!/usr/bin/env python3
"""
Secure Multimedia Data Hiding using Steganography + Cryptography
Supports:
 - Image LSB embedding/extraction (PNG, BMP recommended)
 - Audio LSB embedding/extraction (WAV, 16-bit PCM)
Encryption: Fernet (AES-GCM under the hood) with password-derived key (PBKDF2-HMAC-SHA256)
Usage:
    python secure_steg_crypto_full.py hide_image  -i cover.png -o stego.png  -m "secret" -p "password"
    python secure_steg_crypto_full.py extract_image -i stego.png -p "password"
    python secure_steg_crypto_full.py hide_audio  -i cover.wav -o stego.wav  -m "secret" -p "password"
    python secure_steg_crypto_full.py extract_audio -i stego.wav -p "password"
Notes:
 - Image must have enough pixel capacity: capacity_bytes = (num_pixels * 3) // 8
 - Audio must be 16-bit PCM WAV. capacity_bytes = (num_samples * num_channels) // 8
 - Encrypted payload format stored inside carrier: [4-byte BE length][salt(16)][ciphertext bytes]
   The 4-byte length equals len(salt)+len(ciphertext).
"""

import sys, os, argparse, math, struct
from PIL import Image
import wave
import base64
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
from cryptography.fernet import Fernet
from cryptography.hazmat.backends import default_backend
import secrets

# ---------------- Constants ----------------
SALT_SIZE = 16  # bytes
KDF_ITERATIONS = 200_000
KEY_LEN = 32  # bytes for Fernet base key before base64
HEADER_LEN = 4  # 4-byte length prefix for payload
# -------------------------------------------

def derive_fernet_key_from_password(password: str, salt: bytes) -> bytes:
    """Derive a 32-byte key from password+salt and return a Fernet-compatible base64 key."""
    password_bytes = password.encode('utf-8')
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=KEY_LEN,
        salt=salt,
        iterations=KDF_ITERATIONS,
        backend=default_backend()
    )
    key = kdf.derive(password_bytes)
    return base64.urlsafe_b64encode(key)  # Fernet expects urlsafe-base64-encoded 32-byte key

def encrypt_message(message: str, password: str) -> bytes:
    """
    Encrypt message with password.
    Returns: payload bytes = salt(16) || fernet_token(...)
    We'll return payload prefixed later with length header when embedding.
    """
    salt = secrets.token_bytes(SALT_SIZE)
    fernet_key = derive_fernet_key_from_password(password, salt)
    f = Fernet(fernet_key)
    token = f.encrypt(message.encode('utf-8'))  # bytes
    return salt + token

def decrypt_message_from_payload(payload: bytes, password: str) -> str:
    """
    payload = salt(16) || token
    """
    if len(payload) < SALT_SIZE + 1:
        raise ValueError("Payload too short to contain salt + token.")
    salt = payload[:SALT_SIZE]
    token = payload[SALT_SIZE:]
    fernet_key = derive_fernet_key_from_password(password, salt)
    f = Fernet(fernet_key)
    plain = f.decrypt(token)
    return plain.decode('utf-8')

# ---------------- Image LSB ----------------
def image_capacity_bytes(image_path: str) -> int:
    img = Image.open(image_path)
    width, height = img.size
    num_pixels = width * height
    return (num_pixels * 3) // 8  # 3 channels, 1 LSB per channel

def embed_bytes_in_image(input_image: str, output_image: str, data: bytes):
    """Embed provided bytes into LSBs of image RGB channels. Expects PIL-supported image."""
    img = Image.open(input_image)
    if img.mode not in ('RGB', 'RGBA'):
        img = img.convert('RGB')
    pixels = list(img.getdata())
    num_pixels = len(pixels)
    capacity = (num_pixels * 3) // 8
    if len(data) > capacity:
        raise ValueError(f"Data too large to embed. capacity={capacity} bytes, data={len(data)} bytes")
    # convert data to bit string
    bitstr = ''.join(f'{byte:08b}' for byte in data)
    bit_iter = iter(bitstr)
    new_pixels = []
    used_bits = 0
    for px in pixels:
        r, g, b = px[:3]
        r_bin = r & ~1
        g_bin = g & ~1
        b_bin = b & ~1
        try:
            rb = int(next(bit_iter))
            r_new = r_bin | rb
            used_bits += 1
        except StopIteration:
            r_new = r
        try:
            gb = int(next(bit_iter))
            g_new = g_bin | gb
            used_bits += 1
        except StopIteration:
            g_new = g
        try:
            bb = int(next(bit_iter))
            b_new = b_bin | bb
            used_bits += 1
        except StopIteration:
            b_new = b
        if len(px) == 4:
            # keep alpha channel unchanged
            new_pixels.append((r_new, g_new, b_new, px[3]))
        else:
            new_pixels.append((r_new, g_new, b_new))
        if used_bits >= len(bitstr):
            # copy remaining pixels unchanged
            idx = len(new_pixels)
            new_pixels.extend(pixels[idx:])
            break
    img.putdata(new_pixels)
    img.save(output_image)
    print(f"✅ Embedded {len(data)} bytes into {output_image}")

def extract_bytes_from_image(stego_image: str, expected_total_bytes: int = None) -> bytes:
    """
    Extract bytes from image LSBs. If expected_total_bytes is None we will first read a 4-byte header.
    Format inside image: [4-byte BE length][payload bytes]
    So function returns payload bytes (salt+token) without the initial 4-byte header.
    """
    img = Image.open(stego_image)
    if img.mode not in ('RGB', 'RGBA'):
        img = img.convert('RGB')
    pixels = list(img.getdata())
    bits = []
    for px in pixels:
        for ch in px[:3]:
            bits.append(str(ch & 1))
    bitstr = ''.join(bits)
    # helper to convert bits to bytes
    def bits_to_bytes(bstr):
        return bytes(int(bstr[i:i+8], 2) for i in range(0, len(bstr), 8))
    # first read header 4 bytes -> 32 bits
    if len(bitstr) < 32:
        raise ValueError("Image too small / no data.")
    header_bits = bitstr[:32]
    length = int(header_bits, 2)  # number of payload bytes
    total_bits_needed = 32 + (length * 8)
    if len(bitstr) < total_bits_needed:
        raise ValueError("Image does not contain full payload (expected length mismatch).")
    payload_bits = bitstr[32:32 + length*8]
    payload = bits_to_bytes(payload_bits)
    return payload  # payload bytes (salt+token)

# ---------------- Audio LSB ----------------
def audio_capacity_bytes(wav_path: str) -> int:
    with wave.open(wav_path, 'rb') as wf:
        n_frames = wf.getnframes()
        n_channels = wf.getnchannels()
        # we will use 1 LSB per sample per channel
        return (n_frames * n_channels) // 8

def embed_bytes_in_wav(input_wav: str, output_wav: str, data: bytes):
    """
    Embed data bytes into LSB of 16-bit PCM WAV samples.
    We store [4-byte BE length][payload bytes] as with image.
    """
    with wave.open(input_wav, 'rb') as wf:
        params = wf.getparams()
        n_channels = params.nchannels
        sampwidth = params.sampwidth
        if sampwidth != 2:
            raise ValueError("Only 16-bit PCM WAV files supported (sampwidth=2).")
        n_frames = wf.getnframes()
        frames = wf.readframes(n_frames)
    # unpack samples
    total_samples = n_frames * n_channels
    fmt = '<' + 'h' * total_samples  # little-endian signed 16-bit
    samples = list(struct.unpack(fmt, frames))
    capacity = (total_samples) // 8
    if len(data) > capacity:
        raise ValueError(f"Data too large to embed in audio. capacity={capacity} bytes, data={len(data)} bytes")
    # build bitstring
    bitstr = ''.join(f'{byte:08b}' for byte in data)
    bit_iter = iter(bitstr)
    new_samples = []
    used_bits = 0
    for s in samples:
        try:
            b = next(bit_iter)
            # set LSB to bit b
            if b == '1':
                s_new = s | 1
            else:
                s_new = s & ~1
            used_bits += 1
        except StopIteration:
            s_new = s
        new_samples.append(s_new)
        if used_bits >= len(bitstr):
            # append remaining samples unchanged
            idx = len(new_samples)
            new_samples.extend(samples[idx:])
            break
    new_frames = struct.pack(fmt, *new_samples)
    with wave.open(output_wav, 'wb') as wf:
        wf.setparams(params)
        wf.writeframes(new_frames)
    print(f"✅ Embedded {len(data)} bytes into {output_wav}")

def extract_bytes_from_wav(stego_wav: str) -> bytes:
    """
    Extract payload stored: [4-byte BE length][payload bytes] -> return payload bytes
    """
    with wave.open(stego_wav, 'rb') as wf:
        params = wf.getparams()
        n_channels = params.nchannels
        sampwidth = params.sampwidth
        if sampwidth != 2:
            raise ValueError("Only 16-bit PCM WAV files supported (sampwidth=2).")
        n_frames = wf.getnframes()
        frames = wf.readframes(n_frames)
    total_samples = n_frames * n_channels
    fmt = '<' + 'h' * total_samples
    samples = list(struct.unpack(fmt, frames))
    bits = ''.join(str(s & 1) for s in samples)
    # read 32-bit header
    if len(bits) < 32:
        raise ValueError("WAV too small or no data.")
    header_bits = bits[:32]
    length = int(header_bits, 2)
    total_needed = 32 + (length * 8)
    if len(bits) < total_needed:
        raise ValueError("Audio does not contain full payload (expected length mismatch).")
    payload_bits = bits[32:32 + length*8]
    payload = bytes(int(payload_bits[i:i+8], 2) for i in range(0, len(payload_bits), 8))
    return payload

# ---------------- Helpers to package/unpackage payloads ----------------
def package_payload_bytes(payload: bytes) -> bytes:
    """Return 4-byte length header + payload bytes"""
    length = len(payload)
    header = length.to_bytes(HEADER_LEN, byteorder='big')
    return header + payload

def unpackage_payload_bytes(headered: bytes) -> bytes:
    """Given payload that begins with header, return payload bytes (salt+token)."""
    if len(headered) < HEADER_LEN:
        raise ValueError("Headered data too short")
    length = int.from_bytes(headered[:HEADER_LEN], byteorder='big')
    if len(headered) - HEADER_LEN != length:
        # either earlier extraction returned exactly payload (without header) or mismatch
        # but our image/audio extract functions return payload only (no header) — keep consistent:
        # This function prefers input with header; caller can adapt.
        raise ValueError("Length header mismatch")
    return headered[HEADER_LEN:]

# ---------------- CLI / Main flows ----------------
def hide_image_flow(cover_image, out_image, message, password):
    payload = encrypt_message(message, password)  # salt + token
    headered = package_payload_bytes(payload)
    embed_bytes_in_image(cover_image, out_image, headered)

def extract_image_flow(stego_image, password):
    header_payload = None
    # our extract_bytes_from_image returns payload = salt+token (without header) per implementation.
    # But we stored header + payload. So we must extract full header+payload by adjusting extract function or
    # change embed behaviour. Simpler: extract bitstream extracting until header read and then payload size known.
    # We already wrote extract_bytes_from_image to return payload only (it reads header then payload). So call it:
    payload = extract_bytes_from_image(stego_image)
    # payload here is salt+token
    try:
        message = decrypt_message_from_payload(payload, password)
        print("🔓 Decrypted message:\n", message)
    except Exception as e:
        print("❌ Decryption failed:", str(e))

def hide_audio_flow(cover_wav, out_wav, message, password):
    payload = encrypt_message(message, password)
    headered = package_payload_bytes(payload)
    embed_bytes_in_wav(cover_wav, out_wav, headered)

def extract_audio_flow(stego_wav, password):
    payload = extract_bytes_from_wav(stego_wav)
    try:
        message = decrypt_message_from_payload(payload, password)
        print("🔓 Decrypted message:\n", message)
    except Exception as e:
        print("❌ Decryption failed:", str(e))


# ---------------- Command-line interface ----------------
def build_arg_parser():
    p = argparse.ArgumentParser(description="Secure Multimedia Steganography + Crypto")
    sub = p.add_subparsers(dest='cmd', required=True)

    # hide_image
    hi = sub.add_parser('hide_image', help='Embed message into image (LSB)')
    hi.add_argument('-i', '--input', required=True, help='Input cover image path (PNG/BMP recommended)')
    hi.add_argument('-o', '--output', required=True, help='Output stego image path')
    hi.add_argument('-m', '--message', required=True, help='Message to hide')
    hi.add_argument('-p', '--password', required=True, help='Password for encryption')

    ei = sub.add_parser('extract_image', help='Extract message from stego image')
    ei.add_argument('-i', '--input', required=True, help='Input stego image path')
    ei.add_argument('-p', '--password', required=True, help='Password for decryption')

    ha = sub.add_parser('hide_audio', help='Embed message into WAV (16-bit PCM)')
    ha.add_argument('-i', '--input', required=True, help='Input WAV path (16-bit PCM)')
    ha.add_argument('-o', '--output', required=True, help='Output stego WAV path')
    ha.add_argument('-m', '--message', required=True, help='Message to hide')
    ha.add_argument('-p', '--password', required=True, help='Password for encryption')

    ea = sub.add_parser('extract_audio', help='Extract message from stego WAV')
    ea.add_argument('-i', '--input', required=True, help='Input stego WAV path')
    ea.add_argument('-p', '--password', required=True, help='Password for decryption')

    return p

def main():
    parser = build_arg_parser()
    args = parser.parse_args()

    try:
        if args.cmd == 'hide_image':
            cap = image_capacity_bytes(args.input)
            # payload size estimate: encrypted message size could be larger; do quick check after encryption inside function
            hide_image_flow(args.input, args.output, args.message, args.password)

        elif args.cmd == 'extract_image':
            extract_image_flow(args.input, args.password)

        elif args.cmd == 'hide_audio':
            hide_audio_flow(args.input, args.output, args.message, args.password)

        elif args.cmd == 'extract_audio':
            extract_audio_flow(args.input, args.password)

    except Exception as e:
        print("Error:", e)

if __name__ == '__main__':
    main()
