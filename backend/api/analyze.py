from flask import Flask, request, jsonify
import cv2
import numpy as np
import io
import base64

app = Flask(__name__)

def analyze_dough(image_bytes):
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if img is None:
        raise ValueError("Invalid image format")

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (5, 5), 0)
    _, thresh = cv2.threshold(blur, 127, 255, cv2.THRESH_BINARY)
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    if not contours:
        raise ValueError("No contours found")

    largest_contour = max(contours, key=cv2.contourArea)
    perimeter = cv2.arcLength(largest_contour, True)
    area = cv2.contourArea(largest_contour)

    if perimeter == 0:
        raise ValueError("Perimeter is zero")

    roundness = (4 * np.pi * area) / (perimeter * perimeter)
    cv2.drawContours(img, [largest_contour], -1, (0, 255, 0), 3)

    _, buffer = cv2.imencode('.jpg', img)
    processed_image_base64 = base64.b64encode(buffer).decode('utf-8')

    return {
        'roundness': round(roundness * 100, 2),
        'image': processed_image_base64
    }

@app.route('/api/analyze', methods=['POST'])
def analyze():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
        image = request.files['image'].read()  # Read the image data
        result = analyze_dough(image)  # Call the analyze_dough function!
        return jsonify(result)
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)