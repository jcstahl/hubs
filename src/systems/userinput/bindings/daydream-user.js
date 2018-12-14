import { paths } from "../paths";
import { sets } from "../sets";
import { xforms } from "./xforms";
import { addSetsToBindings } from "./utils";

// vars
const v = s => `/vars/daydream/${s}`;
const touchpad = v("touchpad/axis");
const touchpadRising = v("touchpad/rising");
const touchpadFalling = v("touchpad/falling");
const touchpadPressed = v("touchpad/pressed");
const dpadNorth = v("dpad/north");
const dpadSouth = v("dpad/south");
const dpadEast = v("dpad/east");
const dpadWest = v("dpad/west");
const dpadCenter = v("dpad/center");
const brushSizeDelta = v("brushSizeDelta");
const cursorModDelta = v("cursorModDelta");
const dpadSouthDrop = v("dropSouth");
const dpadCenterDrop = v("dropCenter");

const grabBinding = [
  {
    src: { value: dpadCenter, bool: touchpadRising },
    dest: { value: paths.actions.cursor.grab },
    xform: xforms.copyIfTrue,
    priority: 100
  }
];

const dropOnCenterOrSouth = [
  {
    src: { value: dpadCenter, bool: touchpadRising },
    dest: { value: dpadCenterDrop },
    xform: xforms.copyIfTrue,
    priority: 100
  },
  {
    src: { value: dpadSouth, bool: touchpadRising },
    dest: { value: dpadSouthDrop },
    xform: xforms.copyIfTrue,
    priority: 100
  },
  {
    src: [dpadCenterDrop, dpadSouthDrop],
    dest: { value: paths.actions.cursor.drop },
    xform: xforms.any
  }
];

export const daydreamUserBindings = addSetsToBindings({
  [sets.global]: [
    {
      src: {
        x: paths.device.daydream.axis("touchpadX"),
        y: paths.device.daydream.axis("touchpadY")
      },
      dest: { value: touchpad },
      xform: xforms.compose_vec2
    },
    {
      src: {
        value: paths.device.daydream.button("touchpad").pressed
      },
      dest: { value: touchpadRising },
      xform: xforms.rising
    },
    {
      src: {
        value: paths.device.daydream.button("touchpad").pressed
      },
      dest: { value: touchpadFalling },
      xform: xforms.falling
    },
    {
      src: {
        value: paths.device.daydream.button("touchpad").pressed
      },
      dest: { value: touchpadPressed },
      xform: xforms.copy
    },
    {
      src: {
        value: touchpad
      },
      dest: {
        north: dpadNorth,
        south: dpadSouth,
        east: dpadEast,
        west: dpadWest,
        center: dpadCenter
      },
      xform: xforms.vec2dpad(0.5)
    },
    {
      src: {
        value: dpadEast,
        bool: touchpadRising
      },
      dest: {
        value: paths.actions.snapRotateRight
      },
      xform: xforms.copyIfTrue
    },
    {
      src: {
        value: dpadWest,
        bool: touchpadRising
      },
      dest: {
        value: paths.actions.snapRotateLeft
      },
      xform: xforms.copyIfTrue
    },
    {
      src: {
        value: dpadCenter,
        bool: touchpadRising
      },
      dest: { value: paths.actions.rightHand.startTeleport },
      xform: xforms.copyIfTrue
    },
    {
      src: { value: paths.device.daydream.pose },
      dest: { value: paths.actions.cursor.pose },
      xform: xforms.copy
    },
    {
      src: { value: paths.device.daydream.pose },
      dest: { value: paths.actions.rightHand.pose },
      xform: xforms.copy
    }
  ],

  [sets.cursorHoveringOnInteractable]: grabBinding,
  [sets.cursorHoveringOnUI]: grabBinding,

  [sets.cursorHoldingInteractable]: [
    {
      src: { value: touchpadFalling },
      dest: { value: paths.actions.cursor.drop },
      xform: xforms.copy
    },
    {
      src: {
        value: paths.device.daydream.axis("touchpadY"),
        touching: paths.device.daydream.button("touchpad").touched
      },
      dest: { value: cursorModDelta },
      xform: xforms.touch_axis_scroll()
    },
    {
      src: { value: cursorModDelta },
      dest: { value: paths.actions.cursor.modDelta },
      xform: xforms.copy
    }
  ],

  [sets.rightHandTeleporting]: [
    {
      src: { value: touchpadFalling },
      dest: { value: paths.actions.rightHand.stopTeleport },
      xform: xforms.copy
    }
  ],

  [sets.cursorHoldingPen]: [
    {
      src: { value: dpadNorth, bool: touchpadRising },
      dest: { value: paths.actions.cursor.startDrawing },
      xform: xforms.copyIfTrue,
      priority: 100
    },
    {
      src: { value: touchpadFalling },
      dest: { value: paths.actions.cursor.stopDrawing },
      xform: xforms.copy,
      priority: 100
    },
    {
      src: {
        value: paths.device.daydream.axis("touchpadX"),
        touching: paths.device.daydream.button("touchpad").touched
      },
      dest: { value: brushSizeDelta },
      xform: xforms.touch_axis_scroll(-0.1)
    },
    {
      src: {
        bool: touchpadPressed,
        value: brushSizeDelta
      },
      dest: { value: paths.actions.cursor.scalePenTip },
      xform: xforms.copyIfFalse,
      priority: 100
    },
    {
      src: { value: dpadEast, bool: touchpadRising },
      dest: {
        value: paths.actions.cursor.penPrevColor
      },
      xform: xforms.copyIfTrue,
      priority: 100
    },
    {
      src: { value: dpadWest, bool: touchpadRising },
      dest: {
        value: paths.actions.cursor.penNextColor
      },
      xform: xforms.copyIfTrue,
      priority: 100
    },
    {
      src: {
        bool: touchpadPressed,
        value: cursorModDelta
      },
      dest: { value: paths.actions.cursor.modDelta },
      xform: xforms.copyIfFalse,
      priority: 100
    },
    ...dropOnCenterOrSouth
  ],

  [sets.cursorHoldingCamera]: [
    // Don't drop on touchpad release
    {
      src: {
        value: touchpadFalling
      },
      xform: xforms.noop,
      priority: 100
    },
    {
      src: {
        value: dpadNorth,
        bool: touchpadRising
      },
      dest: { value: paths.actions.cursor.takeSnapshot },
      xform: xforms.copyIfTrue,
      priority: 100
    },
    ...dropOnCenterOrSouth
  ]
});
