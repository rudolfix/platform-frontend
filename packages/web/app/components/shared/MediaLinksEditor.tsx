import { Button, EButtonLayout } from "@neufund/design-system";
import cn from "classnames";
import { connect, FieldArray } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { CommonHtmlProps, TDataTestId, TFormikConnect } from "../../types";
import { FormField } from "./forms";

import closeIcon from "../../assets/img/inline_icons/round_close.svg";
import plusIcon from "../../assets/img/inline_icons/round_plus.svg";
import * as styles from "./MediaLinksEditor.module.scss";

interface ISingleMediaLinkFieldInternalProps {
  isLastElement?: boolean;
  isFirstElement: boolean;
  formFieldKey: string;
  onAddClick: () => void;
  onRemoveClick: () => void;
  name: string;
  url?: string;
  placeholder: string;
  blankField: object;
}

const SingleMediaLinkField: React.FunctionComponent<ISingleMediaLinkFieldInternalProps &
  CommonHtmlProps &
  TDataTestId> = props => {
  const {
    isFirstElement,
    onAddClick,
    onRemoveClick,
    isLastElement,
    placeholder,
    blankField,
    "data-test-id": dataTestId,
  } = props;

  return (
    <div className={styles.fieldRow} data-test-id={dataTestId}>
      <div className={styles.fieldCell}>
        {isLastElement && (
          <Button
            layout={EButtonLayout.LINK}
            className="mt-2"
            svgIcon={plusIcon}
            iconProps={{ alt: <FormattedMessage id="common.add" /> }}
            onClick={onAddClick}
            data-test-id="issuer.eto.media-links.add"
          />
        )}
      </div>

      <div className={cn(styles.fieldCell, "w-100")}>
        {blankField &&
          Object.keys(blankField).map(fieldName => {
            const isFieldWithCharactersLimit = fieldName === "title";

            return isFieldWithCharactersLimit ? (
              <FormField
                key={`${props.name}.${fieldName}`}
                name={`${props.name}.${fieldName}`}
                placeholder={fieldName || placeholder}
                charactersLimit={100}
              />
            ) : (
              <FormField
                key={`${props.name}.${fieldName}`}
                name={`${props.name}.${fieldName}`}
                placeholder={fieldName || placeholder}
              />
            );
          })}
      </div>

      <div className={styles.fieldCell}>
        {!isFirstElement && (
          <Button
            layout={EButtonLayout.LINK}
            className="mt-2"
            svgIcon={closeIcon}
            onClick={onRemoveClick}
            data-test-id="issuer.eto.media-links.remove"
            iconProps={{ alt: <FormattedMessage id="common.remove" /> }}
          />
        )}
      </div>
    </div>
  );
};

interface IProps {
  name: string;
  placeholder: string;
  blankField: object;
}

class MediaLinksEditorLayout extends React.Component<IProps & TFormikConnect> {
  componentDidMount(): void {
    const { name, formik } = this.props;
    const { setFieldValue, values } = formik;

    if (!values[name]) setFieldValue(`${name}.0`, this.props.blankField);
  }

  render(): React.ReactNode {
    const { name, blankField, placeholder, formik } = this.props;
    const { setFieldValue, values } = formik;

    const mediaLinks: object[] = values[name] || [blankField];
    return (
      <FieldArray name={name}>
        {arrayHelpers => (
          <div className={styles.fieldTable}>
            {mediaLinks
              .map((_: object, index: number) => {
                const isLastElement = !(index < mediaLinks.length - 1);
                const isFirstElement = index === 0;
                return (
                  <SingleMediaLinkField
                    blankField={blankField}
                    name={`${name}.${index}`}
                    formFieldKey={"url"}
                    onRemoveClick={() => {
                      arrayHelpers.remove(index);
                    }}
                    onAddClick={() => {
                      setFieldValue(`${name}.${index + 1}`, blankField);
                    }}
                    placeholder={placeholder}
                    isFirstElement={isFirstElement}
                    isLastElement={isLastElement}
                    key={`${name}.${index}`}
                    data-test-id={`issuer.eto.media-links.${name}.row ${name}.${index}`}
                  />
                );
              })
              .reverse()}
          </div>
        )}
      </FieldArray>
    );
  }
}

export const MediaLinksEditor = connect<IProps, unknown>(MediaLinksEditorLayout);
