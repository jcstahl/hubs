import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import styles from "../assets/stylesheets/presence-log.scss";
import mfstyles from "../assets/stylesheets/moonfactory.scss"; //moonfactory追加
import classNames from "classnames";
import html2canvas from "html2canvas";
import { coerceToUrl } from "../utils/media-utils";
import { formatMessageBody } from "../utils/chat-message";
import { createPlaneBufferGeometry } from "../utils/three-utils";
import HubsTextureLoader from "../loaders/HubsTextureLoader";

const textureLoader = new HubsTextureLoader();

const CHAT_MESSAGE_TEXTURE_SIZE = 1024;

const messageBodyDom = (body, from, fromSessionId, onViewProfile, emojiClassName) => {
  const { formattedBody, multiline, monospace, emoji } = formatMessageBody(body, { emojiClassName });
  const wrapStyle = multiline ? styles.messageWrapMulti : styles.messageWrap;
  const messageBodyClasses = {
    [styles.messageBody]: true,
    [styles.messageBodyMulti]: multiline,
    [styles.messageBodyMono]: monospace
  };
  const includeClientLink = onViewProfile && fromSessionId && history && NAF.clientId !== fromSessionId;
  const onFromClick = includeClientLink ? () => onViewProfile(fromSessionId) : () => {};

  const content = (
    <div className={wrapStyle}>
      {from && (
        <div
          onClick={onFromClick}
          className={classNames({ [styles.messageSource]: true, [styles.messageSourceLink]: includeClientLink })}
        >
          {from}:
        </div>
      )}
      <div className={classNames(messageBodyClasses)}>{formattedBody}</div>
    </div>
  );

  return { content, multiline, emoji };
};

//moonfactory追加
const messageBodyDomNote = (body, from, fromSessionId, onViewProfile, emojiClassName) => {
  const { formattedBody, multiline, monospace, emoji } = formatMessageBody(body, { emojiClassName });
  const wrapStyle = multiline ? mfstyles.messageWrapMulti : mfstyles.messageWrap;
  const messageBodyClasses = {
    [mfstyles.messageBody]: true,
    [mfstyles.messageBodyMulti]: multiline,
    [mfstyles.messageBodyMono]: monospace
  };
  const includeClientLink = onViewProfile && fromSessionId && history && NAF.clientId !== fromSessionId;
  const onFromClick = includeClientLink ? () => onViewProfile(fromSessionId) : () => {};

  const content = (
    <div className={wrapStyle}>
      {from && (
        <div
          onClick={onFromClick}
          className={classNames({ [mfstyles.messageSource]: true, [mfstyles.messageSourceLink]: includeClientLink })}
        >
          {from}:
        </div>
      )}
      <div className={classNames(messageBodyClasses)}>{formattedBody}</div>
    </div>
  );

  return { content, multiline, emoji };
};

function renderChatMessage(body, from, allowEmojiRender) {
  const { content, emoji, multiline } = messageBodyDom(body, from, null, null, styles.emoji);
  const isEmoji = allowEmojiRender && emoji;
  const el = document.createElement("div");
  el.setAttribute("class", `${styles.presenceLog} ${styles.presenceLogSpawn}`);
  document.body.appendChild(el);

  const entryDom = (
    <div
      className={classNames({
        [styles.presenceLogEntry]: !isEmoji,
        [styles.presenceLogEntryOneLine]: !isEmoji && !multiline,
        [styles.presenceLogEmoji]: isEmoji
      })}
    >
      {content}
    </div>
  );

  return new Promise((resolve, reject) => {
    ReactDOM.render(entryDom, el, () => {
      const width = el.offsetWidth;
      const height = el.offsetHeight;
      const ratio = height / width;
      const scale = (CHAT_MESSAGE_TEXTURE_SIZE * Math.min(1.0, 1.0 / ratio)) / el.offsetWidth;
      
      html2canvas(el, { backgroundColor: null, scale, logging: false })
        .then(canvas => {
          canvas.toBlob(blob => resolve([blob, width, height]), "image/png");
          el.remove();
        })
        .catch(reject);
    });
  });
}

//moonfactory追加
function renderNote(data, from, allowEmojiRender) {
  const { content, emoji, multiline } = messageBodyDomNote(data.message, from, null, null, mfstyles.emoji);
  const isEmoji = allowEmojiRender && emoji;
  const el = document.createElement("div");
  el.setAttribute("class", `${mfstyles.presenceLog} ${mfstyles.presenceLogSpawn}`);
  document.body.appendChild(el);

  const entryDom = (
    <div
      className={classNames({
        [mfstyles.presenceLogEntry]: !isEmoji,
        [mfstyles.presenceLogEntryOneLine]: !isEmoji && !multiline,
        [mfstyles.presenceLogEmoji]: isEmoji
      })}
    >
      <span>{content}</span>
      <span className={mfstyles.noteTitle}>{data.title}</span>
    </div>
  );

  return new Promise((resolve, reject) => {
    ReactDOM.render(entryDom, el, () => {
      const width = el.offsetWidth;
      const height = el.offsetHeight;
      const scale = 10;
      //HTMLから付箋の画像を作る
      html2canvas(el, { backgroundColor: data.color, scale, logging: false })
        .then(canvas => {
          canvas.toBlob(blob => resolve([blob, width, height]), "image/png");
          el.remove();
        })
        .catch(reject);
    });
  });
}

export async function createInWorldLogMessage({ name, type, body }) {
  if (type !== "chat") return;

  const [blob, width, height] = await renderChatMessage(body, name, false);
  const entity = document.createElement("a-entity");
  const meshEntity = document.createElement("a-entity");

  document.querySelector("a-scene").appendChild(entity);

  entity.appendChild(meshEntity);
  entity.setAttribute("class", "ui");
  entity.setAttribute("is-remote-hover-target", {});
  entity.setAttribute("follow-in-fov", {
    target: "#avatar-pov-node",
    offset: { x: 0, y: 0.0, z: -0.8 }
  });

  const blobUrl = URL.createObjectURL(blob);

  meshEntity.setAttribute("animation__float", {
    property: "position",
    dur: 10000,
    from: { x: 0, y: 0, z: 0 },
    to: { x: 0, y: 0.05, z: -0.05 },
    easing: "easeOutQuad"
  });

  entity.setAttribute("animation__spawn", {
    property: "scale",
    dur: 200,
    from: { x: 0.1, y: 0.1, z: 0.1 },
    to: { x: 1, y: 1, z: 1 },
    easing: "easeOutElastic"
  });

  meshEntity.setAttribute("animation__opacity", {
    property: "meshMaterial.opacity",
    isRawProperty: true,
    delay: 3000,
    dur: 8000,
    from: 1.0,
    to: 0.0,
    easing: "easeInQuad"
  });

  meshEntity.addEventListener("animationcomplete__opacity", () => {
    entity.parentNode.removeChild(entity);
  });

  textureLoader.load(blobUrl, texture => {
    const material = new THREE.MeshBasicMaterial();
    material.transparent = true;
    material.map = texture;
    material.generateMipmaps = false;
    material.needsUpdate = true;

    const geometry = createPlaneBufferGeometry(1, 1, 1, 1, texture.flipY);
    const mesh = new THREE.Mesh(geometry, material);
    meshEntity.setObject3D("mesh", mesh);
    meshEntity.meshMaterial = material;
    const scaleFactor = 400;
    meshEntity.object3DMap.mesh.scale.set(width / scaleFactor, height / scaleFactor, 1);
  });
}

export async function spawnChatMessage(body, from) {
  if (body.length === 0) return;

  try {
    const url = new URL(coerceToUrl(body));
    if (url.host) {
      document.querySelector("a-scene").emit("add_media", body);
      return;
    }
  } catch (e) {
    // Ignore parse error
  }

  // If not a URL, spawn as a text bubble

  const [blob] = await renderChatMessage(body, from, true);
  document.querySelector("a-scene").emit("add_media", new File([blob], "message.png", { type: "image/png" }));
}

//moonfactory追加
export async function spawnNoteMessage(data, from) {
  if (data.message.length === 0) return;

  try {
    const url = new URL(coerceToUrl(data.message));
    if (url.host) {
      document.querySelector("a-scene").emit("add_media", data.message);
      return;
    }
  } catch (e) {
    // Ignore parse error
  }

  // If not a URL, spawn as a text bubble

  const [blob] = await renderNote(data, from, true);
  document.querySelector("a-scene").emit("add_note", {file: new File([blob], "message.png", { type: "image/png" }), data: data});
}

export default function ChatMessage(props) {
  const { content } = messageBodyDom(props.body, props.name, props.sessionId, props.onViewProfile);

  return (
    <div className={props.className}>
      {props.maySpawn && (
        <button
          className={classNames(styles.iconButton, styles.spawnMessage)}
          onClick={() => spawnChatMessage(props.body)}
        />
      )}
      {content}
    </div>
  );
}

ChatMessage.propTypes = {
  name: PropTypes.string,
  maySpawn: PropTypes.bool,
  body: PropTypes.string,
  title: PropTypes.string, //moonfactory追加
  sessionId: PropTypes.string,
  className: PropTypes.string,
  onViewProfile: PropTypes.func
};
