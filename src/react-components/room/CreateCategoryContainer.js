import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  NoteInput,
  NoteLengthWarning
} from "./NoteSidebar";
import { CreateCategory } from "./CreateCategory";
import { MAX_MESSAGE_LENGTH } from "../../utils/chat-message";
import { Button } from "../input/Button";
import { FormattedMessage } from "react-intl";
//import { addCategory } from "../ui-root";

export function CreateCategoryContainer({
  messageValue,
  onClose
}) {
  
  const [message, setMessage] = useState(messageValue || "");
  const createCategory = () => {
    //addCategory(message);
    setMessage("");
    onClose();
  };

  const isOverMaxLength = message.length > MAX_MESSAGE_LENGTH;
  
  return (
    <CreateCategory onClose={onClose}>
      <div id="notecontent" className="centercontent">
        <h4>内容</h4>
      </div>
      <NoteInput
        id="chat-input"
        onChange={e => setMessage(e.target.value)}
        placeholder={"内容..."}
        value={message}
        isOverMaxLength={isOverMaxLength}
        warning={
          <>
            {message.length + 50 > MAX_MESSAGE_LENGTH && (
              <NoteLengthWarning messageLength={message.length} maxLength={MAX_MESSAGE_LENGTH} />
            )}
          </>
        }
      />
      <div id="notecreate" className="centercontent">
        <Button type="button" preset="basic" onClick={createCategory}>
            <FormattedMessage id="notecreateform" defaultMessage="追加" />
        </Button>
      </div>
    </CreateCategory>
  );
}

CreateCategoryContainer.propTypes = {
  onClose: PropTypes.func.isRequired,
  scene: PropTypes.object.isRequired,
  messageValue: PropTypes.string,
  titleValue: PropTypes.string,
  categoryValue: PropTypes.string
};