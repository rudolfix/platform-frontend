import * as cn from "classnames";
import { FieldArray, FormikProps } from "formik";
import * as PropTypes from "prop-types";
import * as React from "react";
import { Col, Row } from "reactstrap";
import { InlineIcon } from "./InlineIcon";

import { CommonHtmlProps } from "../../types";
import { ButtonIcon } from "./Buttons";
import { FormField } from "./forms/formField/FormField";
import * as styles from "./SocialProfilesEditor.module.scss";

import * as closeIcon from "../../assets/img/inline_icons/round_close.svg";
import * as plusIcon from "../../assets/img/inline_icons/round_plus.svg";
import * as linkIcon from "../../assets/img/inline_icons/social_link.svg";

interface ISingleMediaLinkFieldInternalProps {
  isLastElement?: boolean;
  isFirstElement: boolean;
  formFieldKey: string;
  onAddClick: () => void;
  onRemoveClick: () => void;
  placeholder: string;
  name: string;
  url?: string;
  onChange: () => void;
}

const SingleMediaLinkField: React.SFC<
  ISingleMediaLinkFieldInternalProps & CommonHtmlProps
> = props => {
  const {
    isFirstElement,
    onAddClick,
    onRemoveClick,
    isLastElement,
    placeholder,
    formFieldKey,
    onChange,
    url,
  } = props;

  return (
    <Row className="my-4">
      <Col xs={1}>{isLastElement && <ButtonIcon svgIcon={plusIcon} onClick={onAddClick} />}</Col>
      <Col xs={10}>
        <FormField name={`${props.name}.${formFieldKey}`} placeholder={placeholder} />
        {url && (
          <a href={url || "#0"} className={styles.linkWrapper} target="_blank">
            <InlineIcon svgIcon={linkIcon} />
          </a>
        )}
      </Col>
      {!isFirstElement && (
        <Col xs={1}>
          <span className="pt-2">
            <ButtonIcon svgIcon={closeIcon} onClick={onRemoveClick} />
          </span>
        </Col>
      )}
    </Row>
  );
};

export interface ISocialProfile {
  name: string;
  svgIcon: string;
  placeholder?: string;
  label?: string;
  url?: string;
}

interface IProps {
  className?: string;
  profiles: ISocialProfile[];
  name: string;
}

export class SocialProfilesEditor extends React.Component<IProps, any> {
  // ADD Types
  static contextTypes = {
    formik: PropTypes.object,
  };
  constructor(props: IProps) {
    // REMOVE ABOVE
    super(props);
    const selectedField: boolean[] = this.props.profiles.map(() => false);
    const toggledField: ISocialProfile[] = [];
    this.state = { selectedField, toggledField };
  }

  toggleProfileVisibility = (index: any): void => {
    const { setFieldValue, values } = this.context.formik as FormikProps<any>;
    const { name } = this.props;
    const Field = this.state.selectedField as boolean[];
    Field[index] = !this.state.selectedField[index];
    const toggledField = Field.filter(singleField => singleField === true);
    toggledField.forEach((_, index) =>
      setFieldValue(`${name}.${index}.type`, this.props.profiles[index].name),
    );
    this.setState({ ...this.state, selectedField: Field, toggledField });
  };

  render(): React.ReactNode {
    const { setFieldValue, values } = this.context.formik as FormikProps<any>;
    const { profiles, className, name } = this.props;
    const { selectedField, toggledField } = this.state;
    console.log(values)
    return (
      <>
        <div className={cn(styles.socialProfilesEditor, className)} key={1}>
          <div className={styles.tabs}>
            {profiles.map(({ placeholder, name, svgIcon }, index) => (
              <div
                onClick={() => this.toggleProfileVisibility(index)}
                className={cn(Boolean(placeholder) && "is-selected", styles.tab)}
                key={name}
              >
                <InlineIcon svgIcon={svgIcon} />
              </div>
            ))}
          </div>
        </div>

        <FieldArray
          name={name}
          key={2}
          render={arrayHelpers => (
            <>
              {toggledField.map((singleField: boolean, index: number) => {
                const isLastElement = !(index < selectedField.length - 1);
                const isFirstElement = index === 0;
                return (
                  <div key={index}>
                    {singleField && (
                      <SingleMediaLinkField
                        placeholder={profiles[index].placeholder || ""}
                        name={`${name}.${index}`}
                        formFieldKey={"url"}
                        onRemoveClick={() => {
                          arrayHelpers.remove(index);
                        }}
                        onChange={() => {}}
                        onAddClick={() => {}}
                        isFirstElement={true}
                        isLastElement={false}
                      />
                    )}
                  </div>
                );
              })}
            </>
          )}
        />
      </>
    );
  }
}
