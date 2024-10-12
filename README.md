# Image-to-Text OCR Extraction with Node.js

This project is a simple Node.js application that uses Tesseract.js to perform OCR (Optical Character Recognition) on uploaded images. The extracted text is displayed on the frontend. The backend is built with Express.js, and the frontend uses basic HTML and JavaScript.

## Features

- Upload an image for text extraction.
- Extract text from images using Tesseract.js.
- Display the extracted text in the browser.

## Prerequisites

Make sure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (version 14 or above)
- [npm](https://www.npmjs.com/)

## Installation

1. **Clone the repository**:

    ```bash
    git clone https://github.com/your-username/image-to-text-nodejs.git
    cd image-to-text-nodejs
    ```

2. **Install the dependencies**:

    ```bash
    npm install
    ```

3. **Run the application**:

    ```bash
    npm start
    ```

4. **Open the application in your browser**:

    Visit `http://localhost:3000` to access the image upload page.

## Project Structure

- `extracttext.js`: The main Node.js server file.
- `public/`: Contains static HTML and JavaScript files.
- `package.json`: Lists the project dependencies.

## Usage

1. Open the application in your browser.
2. Upload an image file for OCR processing.
3. View the extracted text on the page.

## Deployment

To deploy this project to Render, follow these steps:

1. **Push the code to a GitHub repository**.
2. **Connect the repository to Render** and deploy as a Node.js web service.
3. **Set up environment variables** (if needed).
4. **Use the provided `render.yaml` and `Dockerfile`** to automate the deployment.

## Troubleshooting

- Make sure all dependencies are installed correctly by running `npm install`.
- If there are issues with Tesseract.js, ensure it is correctly installed and included in `package.json`.



## Acknowledgements

- [Tesseract.js](https://github.com/naptha/tesseract.js) for OCR processing.
- [Express.js](https://expressjs.com/) for the web server.
- [Render](https://render.com/) for deployment.
