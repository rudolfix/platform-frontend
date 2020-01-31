// No typings as for now, see https://github.com/ckeditor/ckeditor5/issues/504

declare module "@ckeditor/ckeditor5-build-inline";

declare module "@ckeditor/ckeditor5-react" {
  import * as React from "react";

  export type TCkEditorWriter = {
    setAttribute(attr: string, value: string | boolean | undefined, element: unknown): void;
  };

  export type TLoader = {
    file: Promise<File>;
    on: (
      eventName: "change:status" | "change:uploaded" | "change:uploadTotal",
      event: unknown,
    ) => void;
  };

  export type IUploadAdapterFactory = (loader: TLoader) => IUploadAdapter;

  export interface IUploadAdapter {
    upload(): Promise<{ default: string }>;
    abort(): void;
  }

  export type TCkEditor = {
    getData(): string;
    loadingData: boolean;
    editing: {
      view: {
        change(callback: (writer: TCkEditorWriter) => void): void;
        document: {
          getRoot(): unknown;
        };
      };
    };
    plugins: {
      get: (
        plugin: "FileRepository",
      ) => {
        createUploadAdapter: IUploadAdapterFactory;
        on?: (eventName: string, event: unknown) => void;
      };
    };
  };

  class CKEditor extends React.Component<any> {}

  export default CKEditor;
}
