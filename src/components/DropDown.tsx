import React from "react";
import { Button, OverlayTrigger, Popover } from "react-bootstrap";
import { ThreeDots } from "react-bootstrap-icons";
import "../styles/dropDown.css";

export default function DropDown({
  children,
  placement,
}: {
  children: any;
  placement: any;
}) {
  const popover = <Popover>{children.props.children}</Popover>;

  return (
    <OverlayTrigger trigger="click" placement={placement} overlay={popover}>
      <Button variant="light">
        <ThreeDots></ThreeDots>
      </Button>
    </OverlayTrigger>
  );
}
