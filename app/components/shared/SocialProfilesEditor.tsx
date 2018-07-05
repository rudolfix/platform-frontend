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
import { DevConsoleLogger } from "../../lib/dependencies/Logger";

interface ISingleMediaLinkFieldInternalProps {
  isLastElement?: boolean;
  isFirstElement: boolean;
  formFieldKey: string;
  onAddClick: () => void;
  onRemoveClick: () => void;
  placeholder: string;
  name: string;
  url?: string;
}

const SocialMediaTags: React.SFC<{
  profiles: ISocialProfile[];
  className?: string;
  onClick: (index: number) => void;
}> = props => {
  const { profiles, className, onClick } = props;
  return (
    <div className={cn(styles.socialProfilesEditor, className)}>
      <div className={styles.tabs}>
        {profiles.map(({ placeholder, name, svgIcon }, index) => (
          <div
            onClick={() => onClick(index)}
            className={cn(Boolean(placeholder) && "is-selected", styles.tab)}
            key={name}
          >
            <InlineIcon svgIcon={svgIcon} />
          </div>
        ))}
      </div>
    </div>
  );
};

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
  url?: string;
}

interface IProps {
  className?: string;
  profiles: ISocialProfile[];
  name: string;
}

export class SocialProfilesEditor extends React.Component<IProps, { selectedFields: boolean[] }> {
  constructor(props: IProps) {
    super(props);
    this.state = { selectedFields: [] };
  }

  static contextTypes = {
    formik: PropTypes.object,
  };

  componentDidMount(): void {
    const { values } = this.context.formik as FormikProps<any>;
    const { name, profiles } = this.props;
    const alreadyFilledFields = profiles.map(
      (_, index) =>
        !!values[name][index] && values[name][index].url && values[name][index].url !== "",
    );
    this.setState({ ...this.state, selectedFields: alreadyFilledFields });
  }

  toggleProfileVisibility = (index: number): void => {
    const { setFieldValue } = this.context.formik as FormikProps<any>;
    const { name } = this.props;

    const updatedSelectedFields = this.state.selectedFields;
    updatedSelectedFields[index] = !this.state.selectedFields[index];

    const filteredFields = updatedSelectedFields.filter(
      (singleField, index) => singleField === true,
    );
    filteredFields.forEach((_, index) =>
      setFieldValue(`${name}.${index}.type`, this.props.profiles[index].name),
    );

    this.setState({ selectedFields: updatedSelectedFields });
  };

  render(): React.ReactNode {
    const { setFieldValue, values } = this.context.formik as FormikProps<any>;
    const { profiles, className, name } = this.props;
    const { selectedFields } = this.state;
    
    console.log(values);
    return (
      <>
        <SocialMediaTags
          profiles={profiles}
          className={className}
          onClick={this.toggleProfileVisibility}
        />
        <FieldArray
          name={name}
          render={arrayHelpers =>
            selectedFields.map((singleField: boolean, index: number) => (
              <>
                {singleField && (
                  <SingleMediaLinkField
                    key={index}
                    placeholder={profiles[index].placeholder || ""}
                    name={`${name}.${index}`}
                    formFieldKey={"url"}
                    onRemoveClick={() => {
                      arrayHelpers.remove(index);
                    }}
                    onAddClick={() => {}}
                    isFirstElement={true}
                    isLastElement={false}
                  />
                )}
              </>
            ))
          }
        />
      </>
    );
  }
}
