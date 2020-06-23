import { EKycRequestType } from "@neufund/shared-modules";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { AcceptedKYCDocumentTypes } from "../kyc/utils";
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

storiesOf("Upload/MultiFileUpload", module)
  .add("individual", () => (
    <MultiFileUpload
      uploadType={EKycRequestType.INDIVIDUAL}
      acceptedFiles={AcceptedKYCDocumentTypes}
      onDropFile={() => {}}
      files={[]}
      filesUploading={false}
      layout="vertical"
    />
  ))
  .add("business layout: vertical", () => (
    <MultiFileUpload
      uploadType={EKycRequestType.BUSINESS}
      acceptedFiles={AcceptedKYCDocumentTypes}
      onDropFile={() => {}}
      files={[]}
      layout="vertical"
      filesUploading={false}
    />
  ))
  .add("business layout: horizontal", () => (
    <MultiFileUpload
      uploadType={EKycRequestType.BUSINESS}
      acceptedFiles={AcceptedKYCDocumentTypes}
      onDropFile={() => {}}
      files={[]}
      layout="horizontal"
      filesUploading={false}
    />
  ))
  .add("business state: uploading", () => (
    <MultiFileUpload
      uploadType={EKycRequestType.BUSINESS}
      acceptedFiles={AcceptedKYCDocumentTypes}
      onDropFile={() => {}}
      files={[]}
      filesUploading
    />
  ))
  .add("business state: with files", () => (
    <MultiFileUpload
      uploadType={EKycRequestType.BUSINESS}
      acceptedFiles={AcceptedKYCDocumentTypes}
      onDropFile={() => {}}
      files={files}
      filesUploading={false}
    />
  ));
