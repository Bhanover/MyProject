import React from 'react';
import './UploadModal.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
const UploadModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
        </button>
        {children}
      </div>
    </div>
  );
};

export default UploadModal;