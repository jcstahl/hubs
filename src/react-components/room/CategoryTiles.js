import React, { useMemo } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { FormattedMessage, FormattedRelativeTime, useIntl } from "react-intl";
import styles from "./MediaTiles.scss";
import { ReactComponent as PeopleIcon } from "../icons/People.svg";
import { ReactComponent as StarIcon } from "../icons/Star.svg";
import { ReactComponent as AddIcon } from "../icons/Add.svg";
import { ReactComponent as PenIcon } from "../icons/Pen.svg";
import { ReactComponent as DuplicateIcon } from "../icons/Duplicate.svg";
import { ReactComponent as SearchIcon } from "../icons/Search.svg";
import { ReactComponent as HelpIcon } from "../icons/Help.svg";
import { ReactComponent as ExternalLinkIcon } from "../icons/ExternalLink.svg";

const PUBLISHER_FOR_ENTRY_TYPE = {
  sketchfab_model: "Sketchfab",
  twitch_stream: "Twitch"
};

function useThumbnailSize(isImage, isAvatar, imageAspect) {
  return useMemo(() => {
    let imageHeight = 220;
    if (isAvatar) imageHeight = Math.floor(imageHeight * 1.5);

    // Aspect ratio can vary per image if its an image result. Avatars are a taller portrait aspect, o/w assume 720p
    let imageWidth;
    if (isImage) {
      imageWidth = Math.floor(Math.max(imageAspect * imageHeight, imageHeight * 0.85));
    } else if (isAvatar) {
      imageWidth = Math.floor((9 / 16) * imageHeight);
    } else {
      imageWidth = Math.floor(Math.max((16 / 9) * imageHeight, imageHeight * 0.85));
    }

    return [imageWidth, imageHeight];
  }, [isImage, isAvatar, imageAspect]);
}

function useThumbnail(entry, processThumbnailUrl) {
  const isImage = entry.type.endsWith("_image");
  const isAvatar = entry.type === "avatar" || entry.type === "avatar_listing";
  const imageAspect = entry.images.preview.width / entry.images.preview.height;

  const [thumbnailWidth, thumbnailHeight] = useThumbnailSize(isImage, isAvatar, imageAspect);

  const thumbnailUrl = useMemo(() => {
    return processThumbnailUrl ? processThumbnailUrl(entry, thumbnailWidth, thumbnailHeight) : entry.images.preview.url;
  }, [entry, thumbnailWidth, thumbnailHeight, processThumbnailUrl]);

  return [thumbnailUrl, thumbnailWidth, thumbnailHeight];
}

function BaseTile({ as: TileComponent, className, name, description, tall, wide, children, ...rest }) {
  let additionalProps;

  if (TileComponent === "div") {
    additionalProps = {
      tabIndex: "0",
      role: "button"
    };
  }

  return (
    <TileComponent
      className={classNames(styles.mediaTile, { [styles.tall]: tall, [styles.wide]: wide }, className)}
      {...additionalProps}
      {...rest}
    >
      <div className={styles.thumbnailContainer}>{children}</div>
      {(name || description) && (
        <div className={styles.info}>
          <b>{name}</b>
          {description && <small className={styles.description}>{description}</small>}
        </div>
      )}
    </TileComponent>
  );
}

BaseTile.propTypes = {
  as: PropTypes.elementType,
  className: PropTypes.string,
  name: PropTypes.string,
  description: PropTypes.node,
  children: PropTypes.node,
  tall: PropTypes.bool,
  wide: PropTypes.bool
};

BaseTile.defaultProps = {
  as: "div"
};

function TileAction({ className, children, ...rest }) {
  return (
    <button type="button" className={classNames(styles.tileAction, className)} {...rest}>
      {children}
    </button>
  );
}

TileAction.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node
};

export function CategoryTile({ entry, processThumbnailUrl, onClick, onEdit, onShowSimilar, onCopy, onInfo, ...rest }) {
  
  const creator = entry.attributions && entry.attributions.creator;
  const publisherName =
    (entry.attributions && entry.attributions.publisher && entry.attributions.publisher.name) ||
    PUBLISHER_FOR_ENTRY_TYPE[entry.type];

    
  //const [thumbnailUrl, thumbnailWidth, thumbnailHeight] = useThumbnail(entry, processThumbnailUrl);

  return (
    <BaseTile
      wide={entry.type === "scene" || entry.type === "scene_listing" || entry.type === "room"}
      tall={entry.type === "avatar" || entry.type === "avatar_listing"}
      name={entry.title != "" ? entry.title : "タイトルなし"}
      description={
        <>
          {creator && creator.name === undefined && <span>{creator}</span>}
          {creator && creator.name && !creator.url && <span>{creator.name}</span>}
          {creator && creator.name && creator.url && (
            <a href={creator.url} target="_blank" rel="noopener noreferrer">
              {entry.category}
            </a>
          )}
        </>
      }
      {...rest}
    >
      <a className={styles.thumbnailLink} href={entry.url} rel="noreferrer noopener" onClick={onClick}>
      
      <div className={"categoryTile"} style={{backgroundColor: entry.color}}>
        <span>{entry.message}</span>
      </div>
      </a>
    </BaseTile>
  );
}
//swap src={thumbnailUrl} for image

CategoryTile.propTypes = {
  entry: PropTypes.object.isRequired,
  processThumbnailUrl: PropTypes.func,
  onClick: PropTypes.func,
  onEdit: PropTypes.func,
  onShowSimilar: PropTypes.func,
  onCopy: PropTypes.func,
  onInfo: PropTypes.func
};
