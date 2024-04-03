import React, { Component, useState } from "react";
import PropTypes from "prop-types";
import { injectIntl, } from "react-intl";
import { pushHistoryPath, pushHistoryState, sluglessPath } from "../utils/history";
//import { SOURCES } from "../storage/media-search-store";
import { SOURCES } from "./room/CategorySearch";
import { showFullScreenIfWasFullScreen } from "../utils/fullscreen";
import { AvatarUrlModalContainer } from "./room/AvatarUrlModalContainer";
import { SceneUrlModalContainer } from "./room/SceneUrlModalContainer";
import { ObjectUrlModalContainer } from "./room/ObjectUrlModalContainer";
import { CategoryBrowser } from "./room/CategoryBrowser";
import { fetchReticulumAuthenticated, getReticulumFetchUrl } from "../utils/phoenix-utils";
import { proxiedUrlFor, scaledThumbnailUrlFor } from "../utils/media-url-utils";
import { CategoryTile } from "./room/CategoryTiles";
const isMobile = AFRAME.utils.device.isMobile();
const isMobileVR = AFRAME.utils.device.isMobileVR();
import { useObjectList } from "./room/hooks/useObjectList";

const DEFAULT_FACETS = {
  scenes: [
    { text: "カテゴリー1", params: { filter: "カテゴリー1" } },
    { text: "カテゴリー2", params: { filter: "カテゴリー2" } },
    { text: "カテゴリー3", params: { filter: "カテゴリー3" } },
    { text: "カテゴリー4", params: { filter: "カテゴリー4" } }
  ]
};

// TODO: Migrate to use MediaGrid and media specific components like RoomTile

CategoryBrowserContainer.propTypes = {
  mediaSearchStore: PropTypes.object,
  history: PropTypes.object,
  intl: PropTypes.object,
  hubChannel: PropTypes.object,
  onMediaSearchResultEntrySelected: PropTypes.func,
  performConditionalSignIn: PropTypes.func,
  showNonHistoriedDialog: PropTypes.func.isRequired,
  scene: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
};

export default function CategoryBrowserContainer({
  mediaSearchStore,
  history,
  intl,
  hubChannel,
  onMediaSearchResultEntrySelected,
  performConditionalSignIn,
  showNonHistoriedDialog,
  scene,
  store,
  hideBrowser
}) {
  
  const [state, setState] = useState({ query: "", facets: [], showNav: true, selectNextResult: false, clearStashedQueryOnClose: false });

  const getUrlSource = searchParams =>
  searchParams.get("media_source") || sluglessPath(history.location).substring(7);

  const getStoreAndHistoryState = (mediaSearchStore, history) => {
    const searchParams = new URLSearchParams(history.location.search);
    const result = mediaSearchStore.result;

    const newState = { result, query: state.query || searchParams.get("q") || "" };
    const urlSource = getUrlSource(searchParams);
    newState.showNav = !!(searchParams.get("media_nav") !== "false");
    newState.selectAction = searchParams.get("selectAction") || "spawn";

    if (result && result.suggestions && result.suggestions.length > 0) {
      newState.facets = result.suggestions.map(s => {
        return { text: s, params: { q: s } };
      });
    } else {
      newState.facets = DEFAULT_FACETS[urlSource] || [];
    }

    return newState;
  };

  const storeUpdated = () => {
    console.log("storeUpdated Start");
    const newState = getStoreAndHistoryState(mediaSearchStore, history);
    setState(newState);

    console.log("storeUpdated Mid");
    
    if (state.selectNextResult) {
      close();
    }
    console.log("storeUpdated End");
  };
  
  //setState(getStoreAndHistoryState(mediaSearchStore, history));
  
  console.log("mediaSearchStore Start");
  //mediaSearchStore.addEventListener("statechanged", storeUpdated);
  console.log("mediaSearchStore End");

    


  

  

  const handleEntryClicked = (evt, entry) => {
    evt.preventDefault();

    setState({ clearStashedQueryOnClose: true });
  };

  const handleFacetClicked = facet => {

    const searchParams = getSearchClearedSearchParams(true, true, true);

    for (const [k, v] of Object.entries(facet.params)) {
      setFilter(v);
      //console.log(k+" | "+v);
      
    }
    
  };

  const getSearchClearedSearchParams = (keepSource, keepNav, keepSelectAction) => {
    return mediaSearchStore.getSearchClearedSearchParams(
      history.location,
      keepSource,
      keepNav,
      keepSelectAction
    );
  };

  const pushExitMediaBrowserHistory = (stashLastSearchParams = true) => {
    mediaSearchStore.pushExitMediaBrowserHistory(history, stashLastSearchParams);
  };

  const close = () => {
    hideBrowser();
    
  };

  const containsNote = objects => {
    for (var i=0; i < objects.length; i++) {
      if (objects[i].category == activeFilter)
      {
        return true;
      }
    }
    return false;
  };

  const processThumbnailUrl = (entry, thumbnailWidth, thumbnailHeight) => {
    if (entry.images.preview.type === "mp4") {
      return proxiedUrlFor(entry.images.preview.url);
    } else {
      return scaledThumbnailUrlFor(entry.images.preview.url, thumbnailWidth, thumbnailHeight);
    }
  };

  
    const searchParams = new URLSearchParams(history.location.search);
    const urlSource = getUrlSource(searchParams);
    const { objects, activeObject, selectObject, selectNextObject, selectPrevObject, toggleLights, lightsEnabled } =
    useObjectList();
    const entries = (state.result && state.result.entries) || [];
    const showEmptyStringOnNoResult = urlSource !== "avatars" && urlSource !== "scenes";

    const facets = DEFAULT_FACETS["scenes"];
    //console.log("facets "+facets);
    
    // Don't render anything if we just did a feeling lucky query and are waiting on result.
    if (state.selectNextResult) return <div />;
    
    const [activeFilter, setFilter] = useState("カテゴリー1");
    //console.log("activeFilter "+activeFilter);
    //console.log(containsNote(objects));
    return (
      <CategoryBrowser
        onClose={close}
        selectedSource={urlSource}
        activeFilter={activeFilter} //for selecting facets
        facets={facets}
        onSelectFacet={handleFacetClicked}
      >
        {containsNote(objects) ? (
          <>
            {objects.map((entry, idx) => {
              {return entry.category == activeFilter ? (
                <CategoryTile
                  key={`${entry.id}_${idx}`}
                  entry={entry}
                  processThumbnailUrl={processThumbnailUrl}
                  onClick={e => {selectObject(entry); close();}}
                />
              ) : null}
            })}
          </>
        ) : null}
      </CategoryBrowser>
    );
  
}