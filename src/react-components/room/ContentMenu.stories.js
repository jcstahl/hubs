/* eslint-disable @calm/react-intl/missing-formatted-message */
import React from "react";
import { RoomLayout } from "../layout/RoomLayout";
import { ContentMenu, PeopleMenuButton, ObjectsMenuButton, ViewMenuButton } from "./ContentMenu"; //moonfactory追加

export default {
  title: "Room/ContentMenu",
  parameters: {
    layout: "fullscreen"
  }
};

export const Base = () => (
  <RoomLayout
    viewport={
      <ContentMenu>
        <ViewMenuButton /> //moonfactory追加
        <ObjectsMenuButton />
        <PeopleMenuButton />
      </ContentMenu>
    }
  />
);

export const Active = () => (
  <RoomLayout
    viewport={
      <ContentMenu>
        <ViewMenuButton /> //moonfactory追加
        <ObjectsMenuButton active />
        <PeopleMenuButton />
      </ContentMenu>
    }
  />
);

export const OnlyPeople = () => (
  <RoomLayout
    viewport={
      <ContentMenu>
        <ViewMenuButton /> //moonfactory追加
        <PeopleMenuButton />
      </ContentMenu>
    }
  />
);
