(() => {
  const $iframe = document.getElementById("storybook-preview-iframe");
  const $doc = $iframe.contentDocument;

  const videos = $doc.getElementsByTagName("video");

  for (video of videos) {
    video.currentTime = 1;
    video.pause();
  }
})();
