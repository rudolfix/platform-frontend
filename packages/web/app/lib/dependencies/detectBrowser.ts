import { Browser, detect } from "detect-browser";

export type TBrowserName = Browser | "node" | "unknown";
export type TDetectBrowser = () => {
  name: TBrowserName;
  version: string;
};

export const detectBrowser: TDetectBrowser = () => {
  const detectedBrowser = detect();
  //bot doesn't have a version. Excluding it to simplify the interface
  if (detectedBrowser && detectedBrowser.name !== "bot") {
    return detectedBrowser;
  }

  return {
    name: "unknown",
    version: "0",
  };
};
