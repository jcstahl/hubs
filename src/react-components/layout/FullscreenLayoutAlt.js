import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import styles from "../../assets/stylesheets/moonfactory.scss";
//shirnk height in css

export function FullscreenLayoutAlt({ className, headerLeft, headerRight, contentClassName, children }) {
  return (
    <div className={classNames(styles.fullscreenLayout, className)}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>{headerLeft}</div>
        <div className={styles.headerRight}>{headerRight}</div>
      </div>
      <div className={classNames(styles.content, contentClassName)}>{children}</div>
    </div>
  );
}

FullscreenLayoutAlt.propTypes = {
  className: PropTypes.string,
  headerLeft: PropTypes.node,
  headerRight: PropTypes.node,
  contentClassName: PropTypes.string,
  children: PropTypes.node
};
