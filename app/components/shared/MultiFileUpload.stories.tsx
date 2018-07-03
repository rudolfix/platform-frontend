import { storiesOf } from "@storybook/react";
import * as React from "react";

import { MultiFileUpload } from "./MultiFileUpload";

import * as idImage from "../../assets/img/id_img.svg";

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
  .add("individual default", () => (
    <MultiFileUpload
      uploadType="individual"
      title="Upload ID card or Passport"
      fileInfo="*Colour copies of both sides of ID card"
      acceptedFiles="image/*"
      onDropFile={() => {}}
      files={[]}
      requirements={IndividualRequirements}
      fileUploading={false}
    />
  ))
  .add("with id image", () => (
    <MultiFileUpload
      uploadType="individual"
      title="Upload ID card or Passport"
      fileInfo="*Colour copies of both sides of ID card"
      acceptedFiles="image/*"
      documentTemplateImage={idImage}
      onDropFile={() => {}}
      files={[]}
      requirements={IndividualRequirements}
      fileUploading={false}
    />
  ))
  .add("individual uploading", () => (
    <MultiFileUpload
      uploadType="individual"
      title="Upload ID card or Passport"
      fileInfo="*Colour copies of both sides of ID card"
      acceptedFiles="image/*"
      onDropFile={() => {}}
      files={[]}
      requirements={IndividualRequirements}
      fileUploading={true}
    />
  ))
  .add("with files", () => (
    <MultiFileUpload
      uploadType="individual"
      title="Upload ID card or Passport"
      fileInfo="*Colour copies of both sides of ID card"
      acceptedFiles="image/*"
      onDropFile={() => {}}
      files={files}
      requirements={IndividualRequirements}
      fileUploading={false}
    />
  ));
