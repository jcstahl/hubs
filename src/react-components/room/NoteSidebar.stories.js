import React from "react";
import { RoomLayout } from "../layout/RoomLayout";
import { NoteSidebar, NoteSidebarItem, NoObjects } from "./NoteSidebar";

export default {
  title: "Room/NoteSidebar",
  parameters: {
    layout: "fullscreen"
  }
};

const objects = [
  {
    id: "1",
    name: "Campfire",
    type: "model"
  },
  {
    id: "3",
    name: "longcat.jpg",
    type: "image"
  },
  {
    id: "4",
    name: "Quack.mp3",
    type: "audio"
  },
  {
    id: "5",
    name: "Lofi Hip Hop - beats to test code to",
    type: "video"
  },
  {
    id: "6",
    name: "VRML 1.0 Specification",
    type: "pdf"
  },
  {
    id: "7",
    name: "Unknown Object"
  }
];

export const Base = () => (
  <RoomLayout
    sidebar={
      <NoteSidebar objectCount={objects.length}>
        {objects.map(object => (
          <NoteSidebarItem object={object} key={object.id} />
        ))}
      </NoteSidebar>
    }
  />
);

export const Empty = () => (
  <RoomLayout
    sidebar={
      <NoteSidebar objectCount={0}>
        <NoObjects />
      </NoteSidebar>
    }
  />
);

export const EmptyWithAddObjectsPerms = () => (
  <RoomLayout
    sidebar={
      <NoteSidebar objectCount={0}>
        <NoObjects canAddObjects />
      </NoteSidebar>
    }
  />
);
