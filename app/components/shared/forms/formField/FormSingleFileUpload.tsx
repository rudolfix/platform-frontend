import { Field, FieldProps, FormikProps } from "formik";
import * as PropTypes from "prop-types";
import * as React from "react";

import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { CommonHtmlProps, TAcceptedFileType } from "../../../../types";
import { SingleFileUpload } from "../../SingleFileUpload";

interface IOwnProps {
  name: string;
  label: string | React.ReactNode;
  acceptedFiles: TAcceptedFileType;
  fileFormatInformation: string;
}
interface IDispatchProps {
  uploadFile: (file: File, onDone: (error: any, fileUrl?: string) => any) => any;
  getFile: (fileUrl: string, onDone: (error: any, fileInfo?: any) => any) => any;
}
interface IState {
  isUploading: boolean;
}

export class FormSingleFileUploadComponent extends React.Component<
  IOwnProps & IDispatchProps & CommonHtmlProps,
  IState
> {
  static contextTypes = {
    formik: PropTypes.object,
  };

  state = {
    isUploading: false,
  };

  private onDropFile = (file: File) => {
    this.setState({ ...this.state, isUploading: true });

    this.props.uploadFile(file, this.onUploadingDone);
  };

  private onUploadingDone = (error: any, url?: string) => {
    this.setState({ ...this.state, isUploading: false });

    if (!error && url) {
      this.setValue(url);
    }
  };

  private onDeleteFile = () => {
    this.setValue(undefined);
  };

  private setValue(value?: string): void {
    const { name } = this.props;
    const { setFieldValue } = this.context.formik as FormikProps<any>;

    setFieldValue(name, value);
  }

  render(): React.ReactChild {
    const { label, name, fileFormatInformation, acceptedFiles, className, style } = this.props;

    return (
      <Field
        name={name}
        render={({ field }: FieldProps) => (
          <SingleFileUpload
            acceptedFiles={acceptedFiles}
            fileUploading={this.state.isUploading}
            fileFormatInformation={fileFormatInformation}
            label={label}
            file={field.value}
            onDropFile={this.onDropFile}
            onDeleteFile={this.onDeleteFile}
            className={className}
            style={style}
          />
        )}
      />
    );
  }
}

export const FormSingleFileUpload = appConnect<{}, IDispatchProps, IOwnProps>({
  dispatchToProps: dispatch => ({
    uploadFile: (file, onDone) =>
      dispatch(actions.formSingleFileUpload.uploadFileStart(file, onDone)),
    getFile: (fileUrl, onDone) =>
      dispatch(actions.formSingleFileUpload.getFileStart(fileUrl, onDone)),
  }),
  options: {
    pure: false,
  },
})(FormSingleFileUploadComponent);
