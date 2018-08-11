import { FieldArray, FormikProps } from "formik";
import * as PropTypes from "prop-types";
import * as React from "react";
import { Col, Row } from "reactstrap";

import { CommonHtmlProps, TTranslatedString } from "../../../../types";
import { ButtonIcon } from "../../Buttons";
import { FormHighlightGroup } from "../FormHighlightGroup";
import { FormField } from "../forms";
import { FormTextArea } from "./FormTextArea";

import * as closeIcon from "../../../../assets/img/inline_icons/round_close.svg";
import * as plusIcon from "../../../../assets/img/inline_icons/round_plus.svg";
import { FormTransformingField } from "./FormTransformingField";

interface IProps {
  className?: string;
  name: string;
  label?: TTranslatedString;
  prefix?: string;
  selectedCategory?: { name: string; percentage: number };
  transformRatio?: number;
}
interface IInternalProps {
  addField: () => void;
  removeField: () => void;
  isLastElement: boolean;
  placeholder: string;
  isFirstElement: boolean;
  formFieldKeys: string[];
}

interface IExternalProps {
  suggestions: string[];
  paragraphName?: string;
  blankField: object;
}

const SingleCategoryDistributionComponent: React.SFC<IProps & IInternalProps> = props => {
  const {
    isFirstElement,
    removeField,
    isLastElement,
    placeholder,
    addField,
    formFieldKeys,
    prefix,
    transformRatio,
  } = props;

  return (
    <Row>
      <Col xs={8}>
        <Row className="justify-content-center">
          <Col xs={1} className="pt-2">
            {isLastElement && <ButtonIcon svgIcon={plusIcon} onClick={addField} />}
          </Col>
          <Col>
            <FormField name={`${props.name}.${formFieldKeys[0]}`} placeholder={placeholder} />
          </Col>
        </Row>
      </Col>
      <Col>
        <Row>
          <Col xs={9}>
            {transformRatio ? (
              <FormTransformingField
                min="0"
                prefix={prefix}
                name={`${props.name}.${formFieldKeys[1]}`}
                ratio={transformRatio}
              />
            ) : (
              <FormField
                min="0"
                prefix={prefix}
                name={`${props.name}.${formFieldKeys[1]}`}
                type="number"
              />
            )}
          </Col>
          {!isFirstElement && (
            <span className="pt-2">
              <ButtonIcon svgIcon={closeIcon} onClick={removeField} />
            </span>
          )}
        </Row>
      </Col>
    </Row>
  );
};

export class FormCategoryDistribution extends React.Component<
  IProps & IExternalProps & CommonHtmlProps
> {
  static contextTypes = {
    formik: PropTypes.object,
  };

  private blankField = { ...this.props.blankField };
  private suggestions = [...this.props.suggestions];

  componentWillMount(): void {
    const { setFieldValue, values } = this.context.formik as FormikProps<any>;
    const { name } = this.props;

    if (!values[name])
      this.suggestions.forEach((_, index) => setFieldValue(`${name}.${index}`, this.blankField));
  }

  render(): React.ReactNode {
    const { name, label, className, paragraphName, prefix, transformRatio } = this.props;
    const { setFieldValue, values } = this.context.formik as FormikProps<any>;

    const categoryDistribution = values[name] || [];
    const formFieldKeys = Object.keys(this.blankField);

    return (
      <FormHighlightGroup>
        <div className={className}>
          <div className="mb-4 text-uppercase">{label}</div>
          {paragraphName && <FormTextArea name={paragraphName} placeholder="Detail" />}

          <FieldArray
            name={name}
            render={arrayHelpers => (
              <>
                {categoryDistribution.map(
                  (_: { description: string; percent: number }, index: number) => {
                    const isLastElement = !(index < categoryDistribution.length - 1);
                    const isFirstElement = index === 0;

                    return (
                      <SingleCategoryDistributionComponent
                        key={index}
                        formFieldKeys={formFieldKeys}
                        prefix={prefix}
                        name={`${name}.${index}`}
                        removeField={() => {
                          arrayHelpers.remove(index);
                          this.suggestions.splice(index, 1);
                        }}
                        placeholder={this.suggestions[index] || "Other"}
                        addField={() => {
                          setFieldValue(`${name}.${index + 1}`, this.blankField);
                        }}
                        isFirstElement={isFirstElement}
                        isLastElement={isLastElement}
                        transformRatio={transformRatio}
                      />
                    );
                  },
                )}
              </>
            )}
          />
        </div>
      </FormHighlightGroup>
    );
  }
}
