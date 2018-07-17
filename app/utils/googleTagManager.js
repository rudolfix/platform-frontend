export function installGoogleTagManager() {
  window.dataLayer = window.dataLayer || [];

  function gtag() {
    dataLayer.push(arguments);
  }

  gtag("js", new Date());
  gtag("config", process.env.NF_GOOGLE_TAG_ID);
}
