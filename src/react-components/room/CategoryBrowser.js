import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import styles from "./MediaBrowser.scss";
import { ReactComponent as CloseIcon } from "../icons/Close.svg";
import { IconButton } from "../input/IconButton";
import { FullscreenLayoutAlt } from "../layout/FullscreenLayoutAlt";
import { Button } from "../input/Button";
import { Column } from "../layout/Column";
import { MediaGrid } from "./MediaGrid";

export function CategoryBrowser({
  onClose,
  browserRef,
  selectedSource,
  activeFilter,
  facets,
  onSelectFacet,
  noResultsMessage,
  children
}) {
  return (
    <FullscreenLayoutAlt
      headerLeft={
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      }
    >
      {facets && (
        <div className={classNames(styles.buttonNav, styles.facetsNav)}>
          {facets.map((facet, i) => (
            <Button
              sm
              key={i}
              preset={activeFilter === facet.params.filter ? "primary" : "transparent"}
              onClick={() => onSelectFacet(facet)}
            >
              {facet.text}
            </Button>
          ))}
        </div>
      )}
      <div className={styles.content}>
        <Column grow ref={browserRef}>
          {children ? (
            <MediaGrid
              isVariableWidth={selectedSource === "gifs" || selectedSource === "images"}
              sm={selectedSource === "avatars"}
            >
              {children}
            </MediaGrid>
          ) : (
            <div className={styles.noResults}>{noResultsMessage}</div>
          )}
          
        </Column>
      </div>
    </FullscreenLayoutAlt>
  );
}

CategoryBrowser.propTypes = {
  onClose: PropTypes.func,
  browserRef: PropTypes.any,
  selectedSource: PropTypes.string,
  activeFilter: PropTypes.string,
  facets: PropTypes.array,
  onSelectFacet: PropTypes.func,
  noResultsMessage: PropTypes.node,
  children: PropTypes.node
};

CategoryBrowser.defaultProps = {
  noResultsMessage: "No Results"
};
