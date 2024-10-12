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
            margin: 20px;
          }
          .container {
            max-width: 600px;
            margin: auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
          }
          .result {
            margin-top: 20px;
            white-space: pre-wrap;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Upload an Image for Text Extraction</h2>
          <form id="uploadForm" method="POST" enctype="multipart/form-data">
            <input type="file" id="imageInput" name="image" accept="image/*" required />
            <br /><br />
            <button type="submit">Extract Text</button>
          </form>
          <div class="result" id="result">
            <!-- Extracted text will appear here -->
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
              } else {
                document.getElementById("result").textContent = "Error: Failed to extract text.";
              }
            } catch (error) {
              console.error("Error:", error);
              document.getElementById("result").textContent = "Error: Unable to process the image.";
            }
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
