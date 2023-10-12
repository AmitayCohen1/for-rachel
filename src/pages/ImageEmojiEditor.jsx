import React, { useRef, useState, useEffect } from "react";
import overlayImage from "../assets/Israel.png";
import rachel from "../assets/rachel.png";


const ImageTextEditor = () => {
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [text, setText] = useState("");

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      setImageSrc(e.target.result);
    };

    reader.readAsDataURL(file);
  };

  const drawImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    const overlayImg = new Image();

    img.onload = () => {
      canvas.width = 170;
      canvas.height = 170;
      ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, 170, 170);

      overlayImg.onload = () => {
        const overlayX = (canvas.width - overlayImg.width) / 2;
        const overlayY = 10; // Padding from the top, adjust as needed
        ctx.drawImage(overlayImg, overlayX, overlayY);

        // Set the text settings
        ctx.fillStyle = "white";
        ctx.font = "16px Arial";
        const textWidth = ctx.measureText(text).width;

        // Calculate text position for centering at the bottom
        const padding = 10;
        const backgroundHeight = 20; // Adjust as needed
        const x = (canvas.width - textWidth) / 2;
        const y = canvas.height - padding - backgroundHeight / 2;

        // Draw a black background for the text
        ctx.fillStyle = "black";
        ctx.fillRect(
          x - padding,
          y - backgroundHeight / 2,
          textWidth + 2 * padding,
          backgroundHeight
        );

        // Draw the text on top of the black background
        ctx.fillStyle = "white";
        ctx.fillText(text, x, y + 4); // adding 4 pixels roughly centers the 16px font within the background
      };

      overlayImg.src = overlayImage; // Use the imported image
    };

    img.src = imageSrc;
  };

  useEffect(() => {
    if (imageSrc) {
      drawImage();
    }
  }, [imageSrc]);

  const handleTextChange = (event) => {
    setText(event.target.value);
    drawImage();
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.download = "image-with-text.png";
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  return (
    <div className="p-4 space-y-4 grid place-content-center py-24 border border-black min-h-screen">
      <h1 className="text-center">מוקדש לרחל ❤️</h1>
      <img src={rachel} className="h-72 w-72 mx-auto" />

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        className="p-2 border border-gray-300 rounded"
      />
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Add Text:
          <input
            type="text"
            value={text}
            onChange={handleTextChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
        </label>
      </div>
      {imageSrc && (
        <>
          <canvas ref={canvasRef} className="border border-gray-300" />
          <button
            onClick={handleDownload}
            className="mt-2 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Download Image
          </button>
        </>
      )}
    </div>
  );
};

export default ImageTextEditor;
