function isBrowserSupported() {
  for (var feature in Modernizr) {
    var test = Modernizr[feature];
    // we don't want cssgridlegacy but it's included with cssgrid so ignore it
    if (typeof test === "boolean" && test === false && feature !== "cssgridlegacy") {
      return false;
    }
  }
  return true;
}

if (!isBrowserSupported()) {
  document.getElementById("app").style.display = "none";
  document.getElementById("unsupported-browser").style.display = "flex";
}
