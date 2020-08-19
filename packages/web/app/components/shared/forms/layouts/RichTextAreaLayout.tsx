import InlineEditor from "@ckeditor/ckeditor5-build-inline";
import CKEditor, { IUploadAdapterFactory, TCkEditor, TLoader } from "@ckeditor/ckeditor5-react";
import cn from "classnames";
import { difference } from "lodash";
import * as React from "react";
import { compose } from "recompose";

import { symbols } from "../../../../di/symbols";
import { CommonHtmlProps } from "../../../../types";
import { withDependencies } from "../../hocs/withDependencies";
import { SANITIZER_OPTIONS } from "../../SanitizedHtml";
import { generateErrorId } from "./FormError";
import { generateLabelId } from "./FormLabel";

import * as fieldStyles from "../../Field.module.scss";
import * as styles from "./RichTextAreaLayout.module.scss";

type TDependenciesProps = { uploadAdapterFactory: IUploadAdapterFactory };

type TExternalProps = {
  invalid?: boolean;
  name: string;
  placeholder?: string;
  onChange: (value: string) => void;
  onLoadingData?: (loading: boolean) => void;
  value?: string;
  disabled?: boolean;
};

type Element = keyof HTMLElementTagNameMap;

const areTagsAllowed = (...tags: Element[]) =>
  difference(tags, SANITIZER_OPTIONS.allowedTags).length === 0;

const toolbar = [
  areTagsAllowed("h2", "h3", "h4") && "heading",
  areTagsAllowed("h2", "h3", "h4") && "|",
  areTagsAllowed("strong") && "bold",
  areTagsAllowed("i") && "italic",
  areTagsAllowed("a") && "link",
  areTagsAllowed("ul", "li") && "bulletedList",
  areTagsAllowed("ol", "li") && "numberedList",
  areTagsAllowed("figure", "img", "figcaption") && "imageUpload",
].filter(Boolean);

const RichTextAreaLayoutComponent: React.FunctionComponent<TExternalProps &
  TDependenciesProps &
  CommonHtmlProps> = ({
  name,
  invalid,
  disabled,
  value,
  onChange,
  placeholder,
  uploadAdapterFactory,
  onLoadingData,
}) => {
  const [editor, setEditor] = React.useState<TCkEditor>();

  React.useEffect(() => {
    if (editor) {
      const view = editor.editing.view;

      view.change(writer => {
        const viewEditableRoot = view.document.getRoot();

        writer.setAttribute("aria-describedby", generateErrorId(name), viewEditableRoot);
        writer.setAttribute("aria-invalid", invalid, viewEditableRoot);
        writer.setAttribute("aria-labeledby", generateLabelId(name), viewEditableRoot);
        writer.setAttribute("aria-multiline", true, viewEditableRoot);

        if (process.env.NF_CYPRESS_RUN === "1" || __DEV__) {
          writer.setAttribute("data-test-id", `form.name.${name}`, viewEditableRoot);
        }

        writer.setAttribute("id", name, viewEditableRoot);
      });
    }
  }, [invalid, name, editor]);

  return (
    <div
      className={cn(styles.richTextArea, fieldStyles.richField, {
        [styles.richTextAreaInvalid]: invalid,
      })}
    >
      <CKEditor
        config={{
          placeholder,
          toolbar: [...toolbar, "undo", "redo"],
          image: {
            // You need to configure the image toolbar, too, so it uses the new style buttons.
            toolbar: [
              "imageTextAlternative",
              "|",
              "imageStyle:alignLeft",
              "imageStyle:full",
              "imageStyle:alignRight",
            ],
            styles: ["full", "alignLeft", "alignRight"],
          },
        }}
        editor={InlineEditor}
        disabled={disabled}
        data={value}
        onInit={(ckEditor: TCkEditor) => {
          setEditor(ckEditor);

          ckEditor.plugins.get("FileRepository").createUploadAdapter = (loader: TLoader) => {
            loader.on("change:status", (...options: unknown[]) => {
              const status = options[2] === "reading" || options[2] === "uploading" ? true : false;
              if (onLoadingData) {
                onLoadingData(status);
              }
            });
            return uploadAdapterFactory(loader);
          };
        }}
        onChange={(_: unknown, ckEditor: TCkEditor) => {
          onChange(ckEditor.getData());
        }}
      />
    </div>
  );
};

const RichTextAreaLayout = compose<
  TDependenciesProps & TExternalProps & CommonHtmlProps,
  TExternalProps & CommonHtmlProps
>(
  withDependencies<TDependenciesProps>({
    uploadAdapterFactory: symbols.richTextEditorUploadAdapter,
  }),
)(RichTextAreaLayoutComponent);

export { RichTextAreaLayout, RichTextAreaLayoutComponent };
