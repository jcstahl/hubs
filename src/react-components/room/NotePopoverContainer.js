import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { ReactComponent as PenIcon } from "../icons/Pen.svg";
import { ReactComponent as StickiesIcon } from "../icons/Stickies.svg";
import { ReactComponent as PlusIcon } from "../icons/Plus.svg";
import { ReactComponent as CameraIcon } from "../icons/Camera.svg";
// import { ReactComponent as TextIcon } from "../icons/Text.svg";
// import { ReactComponent as LinkIcon } from "../icons/Link.svg";
import { ReactComponent as GIFIcon } from "../icons/GIF.svg";
import { ReactComponent as ObjectIcon } from "../icons/Object.svg";
import { ReactComponent as AvatarIcon } from "../icons/Avatar.svg";
import { ReactComponent as SceneIcon } from "../icons/Scene.svg";
import { ReactComponent as UploadIcon } from "../icons/Upload.svg";
import { NotePopoverButton } from "./NotePopover";
import { ObjectUrlModalContainer } from "./ObjectUrlModalContainer";
import configs from "../../utils/configs";
import { FormattedMessage } from "react-intl";
import { anyEntityWith } from "../../utils/bit-utils";
import { MyCameraTool } from "../../bit-components";

export function NotePopoverContainer({ scene, mediaSearchStore, showNonHistoriedDialog, hubChannel, createNote, newCate, viewCate }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    function updateItems() {
      const hasActiveCamera = !!anyEntityWith(APP.world, MyCameraTool);
      const hasActivePen = !!scene.systems["pen-tools"].getMyPen();

      let nextItems = [
        {
            id: "createNote",
            icon: PenIcon,
            color: "accent7",
            label: <FormattedMessage id="note-popover.item-type.create" defaultMessage="付箋作成" />,
            onSelect: () => createNote()
        },
        {
            id: "viewCate",
            icon: StickiesIcon,
            color: "accent7",
            label: <FormattedMessage id="note-popover.item-type.viewCate" values={{br: <br/>}} defaultMessage="カテゴリー{br}一覧" />,
            onSelect: () => viewCate()
        },
        {
            id: "createCategory",
            icon: PlusIcon,
            color: "accent7",
            label: <FormattedMessage id="note-popover.item-type.newCate" values={{br: <br/>}} defaultMessage="カテゴリー{br}追加" />,
            onSelect: () => newCate()
        }
      ];

      setItems(nextItems);
    }

    hubChannel.addEventListener("permissions_updated", updateItems);

    updateItems();

    function onSceneStateChange(event) {
      if (event.detail === "camera" || event.detail === "pen") {
        updateItems();
      }
    }

    scene.addEventListener("stateadded", onSceneStateChange);
    scene.addEventListener("stateremoved", onSceneStateChange);

    return () => {
      hubChannel.removeEventListener("permissions_updated", updateItems);
      scene.removeEventListener("stateadded", onSceneStateChange);
      scene.removeEventListener("stateremoved", onSceneStateChange);
    };
  }, [hubChannel, mediaSearchStore, showNonHistoriedDialog, scene]);

  return <NotePopoverButton items={items} />;
}

NotePopoverContainer.propTypes = {
  hubChannel: PropTypes.object.isRequired,
  scene: PropTypes.object.isRequired,
  mediaSearchStore: PropTypes.object.isRequired,
  showNonHistoriedDialog: PropTypes.func.isRequired,
  createNote: PropTypes.func.isRequired,
  newCate: PropTypes.func.isRequired, 
  viewCate: PropTypes.func.isRequired
};
