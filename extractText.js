const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const Tesseract = require("tesseract.js");
const path = require("path");

const app = express();

// Enable CORS for all origins
app.use(cors());

// Middleware for handling file uploads
app.use(fileUpload());

// Serve the static HTML file
app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Image OCR Extraction</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f0f4f8;
      color: #333;
      margin: 0;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
    }
    .container {
      background-color: #fff;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      border-radius: 12px;
      padding: 30px;
      max-width: 600px;
      width: 100%;
      text-align: center;
    }
    h2 {
      margin-bottom: 20px;
      font-size: 24px;
      color: #4a90e2;
    }
    form {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    input[type="file"] {
      padding: 10px;
      border: 2px dashed #4a90e2;
      background-color: #f9f9f9;
      cursor: pointer;
      border-radius: 8px;
      margin-bottom: 15px;
      width: 100%;
      text-align: center;
      color: #666;
    }
    button {
      background-color: #4a90e2;
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 12px 24px;
      font-size: 16px;
      cursor: pointer;
      transition: background-color 0.3s ease;
      margin-top: 10px;
    }
    button:hover {
      background-color: #357abd;
    }
    .result-container {
      margin-top: 25px;
      background-color: #f0f4f8;
      border-radius: 8px;
      padding: 15px;
      color: #333;
      font-size: 16px;
      white-space: pre-wrap;
      max-height: 300px;
      overflow-y: auto;
      position: relative;
    }
    .copy-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      background-color: #4a90e2;
      color: #fff;
      border: none;
      border-radius: 5px;
      padding: 5px 10px;
      cursor: pointer;
      font-size: 14px;
    }
    .copy-btn:hover {
      background-color: #357abd;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Upload an Image for Text Extraction</h2>
    <form id="uploadForm" method="POST" enctype="multipart/form-data">
      <input type="file" id="imageInput" name="image" accept="image/*" required />
      <button type="submit">Extract Text</button>
    </form>
    <div class="result-container" id="resultContainer" style="display: none;">
      <button class="copy-btn" id="copyBtn">Copy</button>
      <div class="result" id="result">
        <!-- Extracted text will appear here -->
      </div>
    </div>
  </div>
  <script>
    document.getElementById("uploadForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData();
      const imageFile = document.getElementById("imageInput").files[0];
      if (!imageFile) {
        alert("Please select an image file.");
        return;
      }
      formData.append("image", imageFile);
      try {
        const response = await fetch("/api/extractText", {
          method: "POST",
          body: formData,
        });
        if (response.ok) {
          const result = await response.json();
          document.getElementById("result").textContent = result.text;
          document.getElementById("resultContainer").style.display = "block";
        } else {
          document.getElementById("result").textContent = "Error: Failed to extract text.";
        }
      } catch (error) {
        console.error("Error:", error);
        document.getElementById("result").textContent = "Error: Unable to process the image.";
      }
    });

    document.getElementById("copyBtn").addEventListener("click", () => {
      const text = document.getElementById("result").textContent;
      navigator.clipboard.writeText(text).then(() => {
        alert("Text copied to clipboard!");
      }, (err) => {
        console.error("Error copying text: ", err);
      });
    });
  </script>
</body>
</html>

  `);
});

// Endpoint for OCR extraction
app.post("/api/extractText", async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).send({ error: "No image file uploaded" });
    }
    const imageBuffer = req.files.image.data;
    const { data: { text } } = await Tesseract.recognize(imageBuffer, "eng"); // Adjust language if needed
    res.status(200).send({ text });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
