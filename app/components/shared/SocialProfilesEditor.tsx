import * as cn from "classnames";
import { FieldArray, FormikProps } from "formik";
import * as PropTypes from "prop-types";
import * as React from "react";
import { Col, Row } from "reactstrap";
import { InlineIcon } from "./InlineIcon";

import { CommonHtmlProps } from "../../types";
import { FormField } from "./forms/formField/FormField";
import * as styles from "./SocialProfilesEditor.module.scss";

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

interface ISingleMediaLinkFieldInternalProps {
  name: string;
  profile: ISocialProfile;
}

const SingleMediaLinkField: React.SFC<
  ISingleMediaLinkFieldInternalProps & CommonHtmlProps
> = props => {
  const { profile, name } = props;

  return (
    <Row className="my-4 justify-content-center">
      <Col xs={10}>
        <FormField name={`${name}.url`} placeholder={profile.placeholder} />
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

interface IState {
  selectedFields: boolean[];
  filteredFields: boolean[];
}

export class SocialProfilesEditor extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { selectedFields: [], filteredFields: [] };
  }

  static contextTypes = {
    formik: PropTypes.object,
  };

  componentDidMount(): void {
    const { values, setFieldValue } = this.context.formik as FormikProps<any>;
    const { name, profiles } = this.props;

    const socialMediaValues = values[name] || [];
    const selectedFields: boolean[] = [];

    profiles.forEach((profile, index) => {
      const value: string = socialMediaValues[index] ? socialMediaValues[index].url : "";
      setFieldValue(`${name}.${index}`, { type: profile.name, url: value });
      //always enable twitter
      selectedFields[index] = (profile.name === 'twitter') ? true : !!value;
    });

    this.setState({ ...this.state, selectedFields });
  }

  toggleProfileVisibility = (index: number): void => {
    const { selectedFields } = this.state;
    selectedFields[index] = !this.state.selectedFields[index];
    this.setState({ selectedFields });
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
            selectedFields.map(
              (singleField: boolean, index: number) =>
                singleField && (
                  <SingleMediaLinkField
                    key={index}
                    name={`${name}.${index}`}
                    profile={profiles[index]}
                  />
                ),
            )
          }
        />
      </div>
    );
  }
}
