import React from "react";
import PropTypes from "prop-types";
import { ButtonGridPopover } from "../popover/ButtonGridPopover";
import { Popover } from "../popover/Popover";
import { ToolbarButton } from "../input/ToolbarButton";
import { FormattedMessage, defineMessage, useIntl } from "react-intl";
import { ReactComponent as NoteIcon } from "../icons/Note.svg";

const notePopoverTitle = defineMessage({
  id: "note-popover.title",
  defaultMessage: "付箋"
});

export function NotePopoverButton({ items }) {
  const intl = useIntl();
  const filteredItems = items.filter(item => !!item);

  // The button is removed if you can't place anything.
  if (filteredItems.length === 0) {
    return null;
  }

  const title = intl.formatMessage(notePopoverTitle);

  return (
    <Popover
      title={title}
      content={props => <ButtonGridPopover items={filteredItems} {...props} />}
      placement="top"
      offsetDistance={28}
    >
      {({ togglePopover, popoverVisible, triggerRef }) => (
        <ToolbarButton
          ref={triggerRef}
          icon={<NoteIcon />}
          selected={popoverVisible}
          onClick={togglePopover}
          label={<FormattedMessage id="note-toolbar-button" defaultMessage="付箋" />}
          preset="accent5"
        />
      )}
    </Popover>
  );
}

NotePopoverButton.propTypes = {
  items: PropTypes.array.isRequired
};
