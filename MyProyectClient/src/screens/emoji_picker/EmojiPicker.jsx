import React from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

const EmojiPicker = ({ onEmojiSelect, showEmojiPicker, setShowEmojiPicker }) => {
  return (
    <>
      <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
        Emoji
      </button>
      {showEmojiPicker && (
        <Picker data={data} onSelect={onEmojiSelect} className="emoji-picker" native />
      )}
    </>
  );
};

export default EmojiPicker;