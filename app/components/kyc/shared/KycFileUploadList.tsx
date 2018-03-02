import * as React from "react";

import { IKycFileInfo } from "../../../lib/api/KycApi.interfaces";

import Dropzone from "react-dropzone";

const ACCEPTED_FILES = "application/pdf, image/*";

interface IProps {
  fileUploading: boolean;
  filesLoading: boolean;
  files: IKycFileInfo[];
  onDropFile: (file: File) => void;
}

export const KycFileUploadList: React.SFC<IProps> = props => {
  const onDrop = (accepted: File[]) => accepted[0] && props.onDropFile(accepted[0]);

  const inner = props.fileUploading ? <div>Uploading a File</div> : <div>Drop a file here</div>;

  const list = props.files.map(f => (
    <div key={f.id}>
      Uploaded file: {f.name} || size: {f.size}
    </div>
  ));

  return (
    <div>
      <Dropzone accept={ACCEPTED_FILES} onDrop={onDrop} disabled={props.fileUploading}>
        {inner}
      </Dropzone>
      <br />
      {list}
    </div>
  );
};
