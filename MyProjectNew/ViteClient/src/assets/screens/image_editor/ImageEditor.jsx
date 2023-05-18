import React, { useState, useRef } from "react";
import AvatarEditor from "react-avatar-editor";

function ImageEditor({ editorRef, src, scale, rotate, onScaleChange, onRotateChange, onImageChange }) {
const [position, setPosition] = useState({ x: 0.5, y: 0.5 });
  
    const handleImageChange = () => {
      const canvas = editorRef.current.getImage();
      onImageChange(canvas.toDataURL("image/jpeg"));
    };
    /*handlePositionChange que se ejecutará cuando se produzca un cambio 
    en la posición de la imagen en el editor*/
    const handlePositionChange = (position, event) => {
      setPosition(position);
    };
  
    return (
      <div style={{ margin: "20px", width: "max-content" }}>
        <AvatarEditor
          ref={editorRef}
          image={src}
          width={250}
          height={250}
          border={10} 
          color={[255, 255, 255, 0.6]}
          scale={scale}
          rotate={rotate}
          position={position}
          onPositionChange={handlePositionChange}
          style={{ pointerEvents: "auto", margin: "20px" }} 
        />
        <div>
          <label htmlFor="scale">Zoom:</label>
          <input
            type="range"
            id="scale"
            min="1"
            max="3"
            step="0.01"
            value={scale}
            onChange={onScaleChange}
          />
        </div>
        <div>
          <label htmlFor="rotate">Rotate:</label>
          <input
            type="range"
            id="rotate"
            min="0"
            max="360"
            step="1"
            value={rotate}
            onChange={onRotateChange}
          />
        </div>
      </div>
    );
  
}

export default ImageEditor;
