import * as cn from "classnames";
import { FieldArray, FormikProps } from "formik";
import * as PropTypes from "prop-types";
import * as React from "react";
import { Col, Row } from "reactstrap";
import { InlineIcon } from "./InlineIcon";

import { CommonHtmlProps } from "../../types";
import { FormField } from "./forms/formField/FormField";
import * as styles from "./SocialProfilesEditor.module.scss";

interface ISingleMediaLinkFieldInternalProps {
  formFieldKey: string;
  placeholder: string;
  name: string;
}

const SocialMediaTags: React.SFC<{
  profiles: ISocialProfile[];
  className?: string;
  onClick: (index: number) => void;
  selectedFields: boolean[];
}> = props => {
  const { profiles, className, onClick, selectedFields } = props;
  return (
    <div className={cn(styles.socialProfilesEditor, className)}>
      <div className={styles.tabs}>
        {profiles.map(({ name, svgIcon }, index) => (
          <div
            onClick={() => onClick(index)}
            className={cn(Boolean(selectedFields[index]) && "is-selected", styles.tab)}
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
  const { placeholder, formFieldKey, name } = props;

  return (
    <Row className="my-4 justify-content-center">
      <Col xs={10}>
        <FormField name={`${name}.${formFieldKey}`} placeholder={placeholder} />
      </Col>
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

    const filteredFields = updatedSelectedFields.filter(singleField => singleField === true);
    filteredFields.forEach((_, index) =>
      setFieldValue(`${name}.${index}.type`, this.props.profiles[index].name),
    );

    this.setState({ selectedFields: updatedSelectedFields });
  };

  render(): React.ReactNode {
    const { profiles, className, name } = this.props;
    const { selectedFields } = this.state;

    return (
      <div className={className}>
        <SocialMediaTags
          profiles={profiles}
          onClick={this.toggleProfileVisibility}
          selectedFields={selectedFields}
        />
        <FieldArray
          name={name}
          render={_ =>
            selectedFields.map((singleField: boolean, index: number) => (
              <>
                {singleField && (
                  <SingleMediaLinkField
                    key={index}
                    placeholder={profiles[index].placeholder || ""}
                    name={`${name}.${index}`}
                    formFieldKey={"url"}
                  />
                )}
              </>
            ))
          }
        />
      </div>
    );
  }
}
