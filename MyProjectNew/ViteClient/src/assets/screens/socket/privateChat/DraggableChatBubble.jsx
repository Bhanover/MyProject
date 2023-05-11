import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { getEmptyImage } from 'react-dnd-html5-backend';

function DraggableChatBubble({ children, isMinimized }) {
  const ref = useRef(null);

  const [, drag, preview] = useDrag(() => ({
    type: "CHAT_BUBBLE",
    item: {},
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop(() => ({
    accept: "CHAT_BUBBLE",
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }

      const delta = monitor.getDifferenceFromInitialOffset();
      const left = Math.round(delta.x);
      const top = Math.round(delta.y);

      ref.current.style.left = `${left}px`;
      ref.current.style.top = `${top}px`;
    },
  }));

  // Esto hace que la vista previa de la burbuja de chat arrastrada sea transparente
  preview(getEmptyImage(), { captureDraggingState: true });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`draggable-minimized-chat ${isMinimized ? "dragging" : ""}`}
    >
      {children}
    </div>
  );
}

export default DraggableChatBubble;
