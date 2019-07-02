import InlineEditor from "@ckeditor/ckeditor5-build-inline";
import CKEditor from "@ckeditor/ckeditor5-react";
import * as cn from "classnames";
import { difference } from "lodash";
import * as React from "react";

import { CommonHtmlProps } from "../../../../types";
import { SANITIZER_OPTIONS } from "../../SanitizedHtml";

import * as fieldStyles from "../../Field.module.scss";
import * as styles from "./RichTextAreaLayout.module.scss";

type TExternalProps = {
  invalid?: boolean;
  name: string;
  placeholder?: string;
  onChange: (value: string) => void;
  value?: string;
  disabled?: boolean;
};

const areTagsAllowed = (...tags: (keyof HTMLElementTagNameMap)[]) =>
  difference(tags, SANITIZER_OPTIONS.allowedTags).length === 0;

const toolbar = [
  areTagsAllowed("h2", "h3", "h4") && "heading",
  areTagsAllowed("h2", "h3", "h4") && "|",
  areTagsAllowed("strong") && "bold",
  areTagsAllowed("i") && "italic",
  areTagsAllowed("a") && "link",
  areTagsAllowed("ul", "li") && "bulletedList",
  areTagsAllowed("ol", "li") && "numberedList",
].filter(Boolean);

const RichTextAreaLayout: React.FunctionComponent<TExternalProps & CommonHtmlProps> = ({
  name,
  invalid,
  disabled,
  value,
  onChange,
  placeholder,
}) => (
  <div
    data-test-id={`form.name.${name}`}
    className={cn(styles.richTextArea, fieldStyles.richField, {
      [styles.richTextAreaInvalid]: invalid,
      // TODO: Should be refactor to pass attributes to CKEditor after we know how (see https://github.com/ckeditor/ckeditor5-react/issues/100)
      "ck-wrapper__invalid": invalid,
    })}
  >
    <CKEditor
      config={{
        placeholder,
        toolbar: [...toolbar, "undo", "redo"],
      }}
      editor={InlineEditor}
      disabled={disabled}
      data={value}
      onChange={(_: unknown, editor: { getData: () => string }) => {
        onChange(editor.getData());
      }}
    />
  </div>
);

export { RichTextAreaLayout };
