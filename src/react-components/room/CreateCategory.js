import React, {forwardRef } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Sidebar } from "../sidebar/Sidebar";
import { CloseButton } from "../input/CloseButton";
import { ReactComponent as WandIcon } from "../icons/Wand.svg";
import { ReactComponent as NoteIcon } from "../icons/Pen.svg";

import { ReactComponent as ChatIcon } from "../icons/Chat.svg";
import { IconButton } from "../input/IconButton";
import { TextAreaInput } from "../input/TextAreaInput";
import { ToolbarButton } from "../input/ToolbarButton";
import styles from "../../assets/stylesheets/moonfactory.scss";
import { FormattedMessage, useIntl } from "react-intl";

export function SpawnMessageButton(props) {
  return (
    <IconButton className={styles.chatInputIcon} {...props}>
      <WandIcon />
    </IconButton>
  );
}

export function NoteLengthWarning({ messageLength, maxLength }) {
  return (
    <p
      className={classNames(styles.chatInputWarning, {
        [styles.warningTextColor]: messageLength > maxLength
      })}
    >
      <FormattedMessage id="chat-message-input.warning-max-characters" defaultMessage="Max characters" />
      {` (${messageLength}/${maxLength})`}
    </p>
  );
}

NoteLengthWarning.propTypes = {
  messageLength: PropTypes.number,
  maxLength: PropTypes.number
};

export const CreateCategoryInput = forwardRef(({ warning, isOverMaxLength, ...props }, ref) => {
  const intl = useIntl();

  return (
    <div className={styles.chatInputContainer}>
      <TextAreaInput
        ref={ref}
        textInputStyles={styles.chatInputTextAreaStyles}
        className={classNames({ [styles.warningBorder]: isOverMaxLength })}
        placeholder={intl.formatMessage({ id: "chat-sidebar.input.placeholder", defaultMessage: "Message..." })}
        {...props}
      />
      {warning}
    </div>
  );
});

CreateCategoryInput.propTypes = {
  onSpawn: PropTypes.func,
  warning: PropTypes.node,
  isOverMaxLength: PropTypes.bool
};

CreateCategoryInput.displayName = "CreateCategoryInput";

export const CreateCategoryMessageList = forwardRef(({ children, ...rest }, ref) => (
  <ul {...rest} className={styles.messageList} ref={ref}>
    {children}
  </ul>
));

CreateCategoryMessageList.propTypes = {
  children: PropTypes.node
};

CreateCategoryMessageList.displayName = "CreateCategoryMessageList";

export function CreateCategory({ onClose, children, ...rest }) {
  return (
    <Sidebar
      title={<FormattedMessage id="create-category-sidebar.title" defaultMessage="カテゴリー追加" />}
      beforeTitle={<CloseButton onClick={onClose} />}
      contentClassName={styles.content}
      disableOverflowScroll
      {...rest}
    >
      {children}
    </Sidebar>
  );
}

CreateCategory.propTypes = {
  onClose: PropTypes.func,
  children: PropTypes.node,
  listRef: PropTypes.func
};

export function CreateCategoryToolbarButton(props) {
  return (
    <ToolbarButton
      {...props}
      icon={<NoteIcon />}
      preset="accent5"
      label={<FormattedMessage id="note-toolbar-button" defaultMessage="付箋" />}
    />
  );
}
