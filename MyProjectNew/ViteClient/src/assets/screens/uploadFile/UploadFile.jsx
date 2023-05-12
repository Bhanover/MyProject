import React, { useState, useRef, useCallback } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import "./UploadFile.css";
import ImageEditor from "../image_editor/ImageEditor";
import { faSmile } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function UploadFile({ isOpen, onClose , onNewFile  }) {
  const [file, setFile] = useState(null);
  const [src, setSrc] = useState(null);
  const [description, setDescription] = useState("");
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const editorRef = useRef(null);
  const [fileType, setFileType] = useState("");
  const [uploading, setUploading] = useState(false);


  const handleDescriptionChange = (emoji) => {
    setDescription((prevDescription) => prevDescription + emoji.native);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const fileURL = URL.createObjectURL(file);
    setFile(file);
    setSrc(fileURL);
    setFileType(file.type.split("/")[0]);
  };
  const onDrop = useCallback((acceptedFiles) => {
    const acceptedFile = acceptedFiles[0];
    setFile(acceptedFile);
    setSrc(URL.createObjectURL(acceptedFile));
    setFileType(acceptedFile.type.split("/")[0]);
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleScaleChange = (event) => {
    setScale(parseFloat(event.target.value));
  };

  const handleRotateChange = (event) => {
    setRotate(parseFloat(event.target.value));
  };

  const handleImageChange = (dataURL) => {
    setSrc(dataURL);
  };

  const handleUploadFile = async (event) => {
    event.preventDefault();

    setUploading(true);

    let formData = new FormData();
    formData.append("description", description);

    const jwtToken = localStorage.getItem("jwtToken");

    if (fileType === "image") {
      const canvas = editorRef.current.getImage();
      const dataURL = canvas.toDataURL("image/jpeg");

      formData.append("file", dataURLtoFile(dataURL, "cropped-image.jpg"));
    } else if (fileType === "video") {
      formData.append("file", file);
    } else {
      close();

      console.error("Invalid file type.");
       return;
    }

    axios
      .post("http://localhost:8081/api/auth/upload", formData, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response.data);
        setUploading(false); // Indicar que la carga se completó
        if (onNewFile) onNewFile();
      })
      .catch((error) => {
        console.error(error);
        setUploading(false); // Indicar que la carga falló

      });
  };

  const dataURLtoFile = (dataurl, filename) => {
    let arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };


  return (
    <div className="upload-container">
      <form onSubmit={handleUploadFile}>
        <div
          {...getRootProps()}
          className="dropzone"
        >
          <input {...getInputProps()} />
          <p>Click aquí o arrastra una imagen o video para subir</p>
        </div>
        {src && fileType === "image" && (
          <ImageEditor
            editorRef={editorRef}
            src={src}
            scale={scale}
            rotate={rotate}
            onScaleChange={handleScaleChange}
            onRotateChange={handleRotateChange}
            onImageChange={handleImageChange}
          />
        )}
        {src && fileType === "video" && (
          <div className="video-preview-container">
            <video className="video-preview" src={src} controls />
          </div>
        )}
        <div className="pushUploadUF">
          <label >Description:</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <FontAwesomeIcon icon={faSmile} />
          </button>
          <button type="submit">Upload File</button>

          {showEmojiPicker && (
            <div className="pickerContainer">
  <Picker 
    className="emoji-picker"
    data={data}
    onEmojiSelect={handleDescriptionChange}
    native
    
  />
    </div>
    
)}

        </div>
        {uploading && (
          <div className="loader-container">
            <div className="loader">Cargando...</div>
          </div>
        )}
       </form>
    </div>
  );
}

export default UploadFile;