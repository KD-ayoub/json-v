import React, { useCallback, useState } from "react";

export default function useFullScreen() {
  const [fullScreen, setFullScreen] = useState(false);
  const handlFullScreen = useCallback(() => {
    if (!fullScreen) {
      document.body.requestFullscreen();
      setFullScreen(!fullScreen);
      return;
    }
    setFullScreen(!fullScreen);
    document.exitFullscreen();
  }, [fullScreen]);
  return { fullScreen, handlFullScreen };
}
