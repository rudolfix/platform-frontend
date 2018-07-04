import { storiesOf } from "@storybook/react";
import * as React from "react";

import { MultiFileUpload } from "./MultiFileUpload";

const files = [
  {
    id: "test id 1",
    fileName: "test file 1",
  },
  {
    id: "test id 2",
    fileName: "test file 2",
  },
];

const IndividualRequirements = [
  "Colored photo",
  "Full name",
  "Date of birth",
  "Valid expiration date",
  "Official document number",
  "High quality, coloured .png or .jpg files only",
];

storiesOf("MultiFileUpload", module)
  .add("individual", () => (
    <MultiFileUpload
      uploadType="individual"
      acceptedFiles="image/*"
      onDropFile={() => {}}
      files={[]}
      requirements={IndividualRequirements}
      fileUploading={false}
      layout="vertical"
    />
  ))
  .add("business layout: vertical", () => (
    <MultiFileUpload
      uploadType="business"
      acceptedFiles="image/*"
      onDropFile={() => {}}
      files={[]}
      layout="vertical"
      requirements={IndividualRequirements}
      fileUploading={false}
    />
  ))
  .add("business layout: horizontal", () => (
    <MultiFileUpload
      uploadType="business"
      acceptedFiles="image/*"
      onDropFile={() => {}}
      files={[]}
      layout="horizontal"
      requirements={IndividualRequirements}
      fileUploading={false}
    />
  ))
  .add("business state: uploading", () => (
    <MultiFileUpload
      uploadType="business"
      acceptedFiles="image/*"
      onDropFile={() => {}}
      files={[]}
      requirements={IndividualRequirements}
      fileUploading={true}
    />
  ))
  .add("business state: with files", () => (
    <MultiFileUpload
      uploadType="business"
      acceptedFiles="image/*"
      onDropFile={() => {}}
      files={files}
      requirements={IndividualRequirements}
      fileUploading={false}
    />
  ));
