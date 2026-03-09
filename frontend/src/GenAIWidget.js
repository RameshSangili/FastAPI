import { useState } from "react";
import Chat from "./Chat";
import "./widget.css";

function GenAIWidget() {

  const [open, setOpen] = useState(false);


  return (
    <>
      {open && (
        <div className="widget-panel">
          <Chat />
        </div>
      )}

      <div className="widget-button" onClick={() => setOpen(!open)}>
      💬
      </div>
    </>
  );
}

export default GenAIWidget;