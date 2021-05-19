import React, { useState, useCallback, useRef, useEffect } from "react";
import ReactCrop from "react-image-crop";
import canvasToImage from "canvas-to-image";
import "react-image-crop/dist/ReactCrop.css";

function generateDownload(canvas, crop) {
  if (!crop || !canvas) {
    return;
  }

  canvas.toBlob(
    (blob) => {
      const previewUrl = window.URL.createObjectURL(blob);

      const anchor = document.createElement("a");
      anchor.download = "cropPreview.png";
      anchor.href = URL.createObjectURL(blob);
      anchor.click();

      window.URL.revokeObjectURL(previewUrl);
    },
    "image/png",
    1
  );
}

const Crop = ({ img, callback, reload, circle }) => {
  const [upImg, setUpImg] = useState();
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [crop, setCrop] = useState({ unit: "%", width: 30, aspect: 1 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [loaded, setLoaded] = useState(!reload);

  const onSelectFile = (e) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => setUpImg(reader.result));
    reader.readAsDataURL(e);
  };
  const convertFile = (e) => {
    e.toBlob(
      function (blob) {
        var newImg = document.createElement("img"),
          url = URL.createObjectURL(blob);

        newImg.onload = function () {
          // no longer need to read the blob so it's revoked
          URL.revokeObjectURL(url);
        };

        newImg.src = url;
        document.body.appendChild(newImg);
      },
      "image/png",
      0.95
    );
  };

  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");
    const pixelRatio = window.devicePixelRatio;

    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );
    var options = {
      name: "custom name", // default image
      type: "png", // default png, accepted values jpg or png
      quality: 0.9, // default 1, can select any value from 0 to 1 range
    };
    var cv = document.getElementById("canvas");
    var dataURL = cv.toDataURL("image/png", 0.1);

    callback(dataURL);
  }, [completedCrop]);
  if (reload) {
    onSelectFile(img);
    reload = false;
  }
  return (
    <div className="App">
      <ReactCrop
        src={upImg}
        onImageLoaded={onLoad}
        crop={crop}
        onChange={(c) => setCrop(c)}
        onComplete={(c) => setCompletedCrop(c)}
        circularCrop={circle}
      />
      <div hidden>
        <canvas
          id="canvas"
          ref={previewCanvasRef}
          // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
          style={{
            width: Math.round(completedCrop?.width ?? 0),
            height: Math.round(completedCrop?.height ?? 0),
            borderRadius: "50%",
          }}
        />
      </div>
    </div>
  );
};
export default Crop;
