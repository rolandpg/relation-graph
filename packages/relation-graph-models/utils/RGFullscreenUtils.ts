export const toggleFullscreen = async(el?: HTMLElement) => {
  const elem = el || document.documentElement;
  if (getFullscreenElement()) {
    await exitFullscreen();
  } else {
    await openFullscreen(elem);
  }
}
export const setFullscreen = async(el: HTMLElement, fullscreen: boolean) => {
  const elem = el || document.documentElement;
  if (fullscreen) {
    await openFullscreen(elem);
  } else {
    await exitFullscreen();
  }
}
export const getFullscreenElement = () => {
  return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
}
const openFullscreen = async (elem: HTMLElement): Promise<void> => {
  if (elem.requestFullscreen) {
    await elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    await elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    await elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    await elem.msRequestFullscreen();
  }
}
const exitFullscreen = async (): Promise<void> => {
  if (document.exitFullscreen) {
    await document.exitFullscreen();
  } else if (document.mozCancelFullScreen) { /* Firefox */
    await document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
    await document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE/Edge */
    await document.msExitFullscreen();
  }
}
