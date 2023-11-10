import React, { createContext, useContext, useState, useRef } from "react";
import PropTypes from "prop-types";
import {
  NoteSidebar,
  NoteInput,
  NoteLengthWarning
} from "./NoteSidebar";
import { spawnNoteMessage } from "../chat-message";
import { MAX_MESSAGE_LENGTH } from "../../utils/chat-message";
import { Button } from "../input/Button";
import { FormattedMessage } from "react-intl";
import { ToolbarButtonAlt } from "../input/ToolbarButtonAlt";
import styles from "../../assets/stylesheets/moonfactory.scss";

var NoteColor = "#ffe992";
var lastSelection = 1;
var data = {};
var noteReady = false;

//入室順番でデフォルト色を設定
export function SetDefaultNoteColor(value)
{
  lastSelection = value;
}

export function NoteSidebarContainer({
  newNote,
  noteData,
  togglePen,
  scene,
  onClose,
  deleteOld
}) {
  
  const [newSelection, setSelection] = useState(false);
  const [message, setMessage] = useState(newNote? "" : noteData.message);
  const [title, setTitle] = useState(newNote? "" : noteData.title);
  const [category, setCategory] = useState(newNote? 'カテゴリー1' : noteData.category);
  const [note1Class, setNote1] = useState(newNote? 
    { classname: lastSelection == 1 ? 'buttonSelected' : 'buttonUnselected'}
    :
    { classname: noteData.color == "#ffe992" ? 'buttonSelected' : 'buttonUnselected'}
    );
  const [note2Class, setNote2] = useState(newNote? 
    { classname: lastSelection == 2 ? 'buttonSelected' : 'buttonUnselected'}
    :
    { classname: noteData.color == "#6ab9ff" ? 'buttonSelected' : 'buttonUnselected'});
  const [note3Class, setNote3] = useState(newNote? 
    { classname: lastSelection == 3 ? 'buttonSelected' : 'buttonUnselected'}
    :
    { classname: noteData.color == "#6fed99" ? 'buttonSelected' : 'buttonUnselected'}
    );
  const [note4Class, setNote4] = useState(newNote?
    { classname: lastSelection == 4 ? 'buttonSelected' : 'buttonUnselected'}
    :
    { classname: noteData.color == "#ffc0cb" ? 'buttonSelected' : 'buttonUnselected'});
  
  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  //付箋のデータをまとめて、作成または編集する
  const onSpawnMessage = () => {

    data = {
      position: noteData.position,
      rotation: noteData.rotation, 
      message: message, 
      category: category, 
      title: title, 
      color: NoteColor,
      new: newNote};

    if (!newSelection && !newNote)
    {
      data.color = noteData.color;
    }
    if (!newNote)
    {
      spawnNoteMessage(data);
    }
    setMessage("");
  };

  //付箋の位置を取って、作成する
  const getPoint = () => {
    console.log("getPoint");
    noteReady = true;
    const hasActivePen = !!scene.systems["pen-tools"].getMyPen();
    if (!hasActivePen)
    {
      console.log("togglePen1");
      togglePen();
      console.log("togglePen2");
    }
    onSpawnMessage();
    console.log("onSpawnMessage end");
    onClose();
  }

  //昔の付箋の削除して、編集した付箋を作成する
  const onEditMessage = () => {
    deleteOld();
    onSpawnMessage();
    onClose();
  };

  //色の選択ボタン
  function SelectCircle(value) {

    setNote1({ classname: 'buttonUnselected'});
    setNote2({ classname: 'buttonUnselected'});
    setNote3({ classname: 'buttonUnselected'});
    setNote4({ classname: 'buttonUnselected'});
   
     switch (value)
     {
       case 1:
         NoteColor = "#ffe992";
         setNote1({ classname: 'buttonSelected'});
         break;
       case 2:
         NoteColor = "#6ab9ff";
         setNote2({ classname: 'buttonSelected'});
         break;
       case 3:
         NoteColor = "#6fed99";
         setNote3({ classname: 'buttonSelected'});
         break;
       case 4:
         NoteColor = "#ffc0cb";
         setNote4({ classname: 'buttonSelected'});
         break;
     }
     lastSelection = value;
     setSelection(true);
   }

  const isOverMaxLength = message.length > MAX_MESSAGE_LENGTH;
  const titleOverMaxLength = title.length > MAX_MESSAGE_LENGTH;

  return (
    <NoteSidebar onClose={onClose}>
      <div id="notetitle" className="centercontent">
        <h4>タイトル</h4>
      </div>
      <NoteInput
        id="title-input"
        onChange={e => setTitle(e.target.value)}
        placeholder={"タイトル..."}
        value={title}
        isOverMaxLength={titleOverMaxLength}
        warning={
          <>
            {title.length + 50 > MAX_MESSAGE_LENGTH && (
              <NoteLengthWarning messageLength={title.length} maxLength={MAX_MESSAGE_LENGTH} />
            )}
          </>
        }
      />
      <div id="notecategory" className="centercontent">
        <h4>カテゴリー</h4>
      </div>

      <div className={styles.dropdown}>
      <Dropdown
        options={[
          { label: 'カテゴリー1', value: 'カテゴリー1' },
          { label: 'カテゴリー2', value: 'カテゴリー2' },
          { label: 'カテゴリー3', value: 'カテゴリー3' },
          { label: 'カテゴリー4', value: 'カテゴリー4' }
        ]}
        value={category}
        onChange={handleCategoryChange}
      />
      </div>

      <div id="notecolorstitle" className="centercontent">
        <h4>色選択</h4>
      </div>
      <div id="notecolors">
            <ToolbarButtonAlt 
              className={note1Class.classname}
              label={<FormattedMessage id="notecolor1label" defaultMessage="黄" />}
              onClick={() => SelectCircle(1)}
              bgColor={"bgColor1"}
            />
            <ToolbarButtonAlt
              className={note2Class.classname}
              label={<FormattedMessage id="notecolor2label" defaultMessage="青" />}
              onClick={() => SelectCircle(2)}
              bgColor={"bgColor2"}
            />
            <ToolbarButtonAlt
              className={note3Class.classname}
              label={<FormattedMessage id="notecolor3label" defaultMessage="緑" />}
              onClick={() => SelectCircle(3)}
              bgColor={"bgColor3"}
            />
            <ToolbarButtonAlt
              className={note4Class.classname}
              label={<FormattedMessage id="notecolor4label" defaultMessage="ピンク" />}
              onClick={() => SelectCircle(4)}
              bgColor={"bgColor4"}
            />
        </div>
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
        {newNote ? 
          <Button type="button" preset="basic" onClick={getPoint}>
            <FormattedMessage id="notecreateform" defaultMessage="作成" />
          </Button>
          : 
          <Button type="button" preset="basic" onClick={onEditMessage}>
            <FormattedMessage id="noteeditform" defaultMessage="編集" />
          </Button>          
        }
        
      </div>
    </NoteSidebar>
  );
}

NoteSidebarContainer.propTypes = {
  onClose: PropTypes.func.isRequired,
  deleteOld: PropTypes.func,
  scene: PropTypes.object.isRequired,
  newNote: PropTypes.bool,
  noteData: PropTypes.any,
  togglePen: PropTypes.func
};

const Dropdown = ({ value, options, onChange }) => {

  return (

      <select value={value} onChange={onChange}>
 
        {options.map((option) => (
 
          <option key={option.value} value={option.value}>{option.label}</option>
 
        ))}
 
      </select> 
  );
 
 };

//付箋を作成したい時、レーザーポインターに知らせる
export const CheckNoteReady = () =>
{
  return noteReady;
}

//レーザーポインターから位置を貰ったら、付箋を作成する
export const NotePosition = (value) =>
{
  data.position = value;
  
  if (data.message == "")
  {
    data.message = " ";
  }
  spawnNoteMessage(data);
  const scene = AFRAME.scenes[0];
  scene.emit("penButtonPressed");
  noteReady = false;

  //console.log("NotePosition "+data.position.x+" "+data.position.y+" "+data.position.z);
  //window.APP.store.state.preferences.noteReady = false;
}