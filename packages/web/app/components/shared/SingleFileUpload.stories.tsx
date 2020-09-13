import { EMimeType } from "@neufund/shared-utils";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { SingleFileUpload } from "./SingleFileUpload";

import image from "../../assets/img/header/social_logo.png";

//TODO add error state test
storiesOf("Upload/SingleFileUpload", module)
  .add("default", () => (
    <SingleFileUpload
      acceptedFiles={[EMimeType.ANY_IMAGE_TYPE, EMimeType.PDF]}
      fileUploading={false}
      fileFormatInformation=".png, .svg"
      label="Some image"
      onDropFile={() => {}}
      name="someImage"
      onDownload={() => action("Download")}
      onRemove={() => action("Remove")}
    />
  ))
  .add("with file", () => (
    <SingleFileUpload
      acceptedFiles={[EMimeType.ANY_IMAGE_TYPE, EMimeType.PDF]}
      fileUploading={false}
      fileFormatInformation=".png, .svg"
      label="Some image"
      file={image}
      onDropFile={() => {}}
      name="someImage"
      onDownload={() => action("Download")}
      onRemove={() => action("Remove")}
    />
  ));
