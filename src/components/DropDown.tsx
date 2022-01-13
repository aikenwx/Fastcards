import React from "react";
import { Button, Dropdown, OverlayTrigger, Popover } from "react-bootstrap";
import { ThreeDots } from "react-bootstrap-icons";
import "../styles/dropdown.scss"

export default function DropDown({
  children,
  placement,
  show,
  onHide,
  onToggle,
  onBlur,
}: {
  children: any;
  placement?: any;
  show?: boolean;
  onHide?: any;
  onToggle?: any;
  onBlur?: any;
}) {
  const popover = (
    <Popover>
      <Dropdown.Menu show>{children.props.children}</Dropdown.Menu>
    </Popover>
  );

  return (
    <div onBlur={onBlur}>
      <OverlayTrigger
        trigger="click"
        placement={placement}
        overlay={popover}
        show={show}
        onExited={onHide}
        onToggle={onToggle}
      >
        <Button variant="light">
          <ThreeDots></ThreeDots>
        </Button>
      </OverlayTrigger>
    </div>
  );
}
