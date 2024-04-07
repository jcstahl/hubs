import React, { useEffect, useState } from "react";
import className from "classnames";
import PropTypes from "prop-types";
import styles from "../../assets/stylesheets/moonfactory.scss";
import avatar_kimura from "../../assets/avatars/avatar_kimura.png"
import avatar_ken from "../../assets/avatars/avatar_ken.png"
import avatar_lina from "../../assets/avatars/avatar_lina.png"
import avatar_sakaguchi from "../../assets/avatars/avatar_sakaguchi.png"
import avatar_other from "../../assets/avatars/avatar_other.png"

import { getMicrophonePresences } from "../../utils/microphone-presence";
import { useRoomPermissions } from "./hooks/useRoomPermissions";
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
function getAvatar(avatarName, displayName)
{
  var avatar;
  var newname = displayName;
  switch (avatarName)
  {
    case "Kimura":
      avatar = avatar_kimura;
    break;
    case "Ken":
      avatar = avatar_ken;
    break;
    case "Lina":
      avatar = avatar_lina;
    break;
    case "Sakaguchi":
      avatar = avatar_sakaguchi;
    break;
    default:
      avatar = avatar_other;
    break;
  }

  if (displayName.length > 6)
  {
    newname = displayName.substring(0,6)+"...";
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
            <div key={person.profile}>
              <div className={styles.avatarContainer}>
                {getAvatar(person.profile.avatarName, getPersonName(person))}
              </div>
            </div>
          );
        })}
    </div>
  );
}

AvatarMenu.propTypes = {
  children: PropTypes.node
};
