import { storiesOf } from "@storybook/react";
import * as React from "react";

import { SingleFileUpload } from "./SingleFileUpload";

import * as image from "../../assets/img/header/social_logo.png";

storiesOf("SingleFileUpload", module)
  .add("default", () => (
    <SingleFileUpload
      acceptedFiles="image/*"
      fileUploading={false}
      filesLoading={false}
      fileFormatInformation=".png, .svg"
      uploadCta="Upload file"
      files={[]}
      onDropFile={() => {}}
    />
  ))
  .add("with files", () => (
    <SingleFileUpload
      acceptedFiles="image/*"
      fileUploading={false}
      filesLoading={false}
      fileFormatInformation=".png, .svg"
      uploadCta="Upload file"
      files={[
        {
          id: "123",
          fileName: "filename",
          preview: image,
        },
      ]}
      onDropFile={() => {}}
    />
  ));
