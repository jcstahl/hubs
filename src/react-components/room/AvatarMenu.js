import React, { useEffect, useState } from "react";
import className from "classnames";
import PropTypes from "prop-types";
import styles from "../../assets/stylesheets/moonfactory.scss";
import avatar1 from "../../assets/avatars/avatar1.png"
import avatar2 from "../../assets/avatars/avatar2.png"

import { getMicrophonePresences } from "../../utils/microphone-presence";
import { useRoomPermissions } from "./useRoomPermissions";
import {userFromPresence} from "./PeopleSidebarContainer";

export function AvatarMenuButton({active, children, ...props }) {
  return (
    <button className={className(styles.AvatarMenuButton, { [styles.active]: active })} {...props}>
      {children}
    </button>
  );
}

AvatarMenuButton.propTypes = {
  children: PropTypes.node,
  active: PropTypes.bool
};

function usePeopleList(presences, mySessionId, micUpdateFrequency = 500) {
  const [people, setPeople] = useState([]);
  const { voice_chat: voiceChatEnabled } = useRoomPermissions();

  useEffect(() => {
    let timeout;

    function updateMicrophoneState() {
      const micPresences = getMicrophonePresences();

      setPeople(
        Object.entries(presences).map(([id, presence]) => {
          return userFromPresence(id, presence, micPresences, mySessionId, voiceChatEnabled);
        })
      );

      timeout = setTimeout(updateMicrophoneState, micUpdateFrequency);
    }

    updateMicrophoneState();

    return () => {
      clearTimeout(timeout);
    };
  }, [presences, micUpdateFrequency, setPeople, mySessionId, voiceChatEnabled]);

  return people;
}

//アバターの名前を返す
function getPersonName(person) {
  return person.profile.displayName + "";
}

//アバターの画像を返す
function getAvatar(id, name)
{
  var avatar;
  var newname = name;
  switch (id)
  {
    case "L9fFxRv":
      avatar = avatar1;
    break;
    default:
      avatar = avatar2;
    break;
  }

  if (name.length > 6)
  {
    newname = name.substring(0,6)+"...";
  }

  return (
    <div className={styles.image}>
      <img src={avatar} alt=""/>
      <span>{newname}</span>
    </div>
);
}

export function AvatarMenu({presences, mySessionId}) {
  const people = usePeopleList(presences, mySessionId);
  return (
    <div className={styles.avatarMenu}>
      {people.map(person => {
          return (
            <div className={styles.avatarContainer}>
              {getAvatar(person.profile.avatarId, getPersonName(person))}
            </div>
          );
        })}
    </div>
  );
}

AvatarMenu.propTypes = {
  children: PropTypes.node
};
