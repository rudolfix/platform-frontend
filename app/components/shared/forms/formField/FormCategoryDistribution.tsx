import * as cn from "classnames";
import { FieldArray, FormikProps } from "formik";
import * as PropTypes from "prop-types";
import * as React from "react";
import { Col, Row } from "reactstrap";

import { CommonHtmlProps } from "../../../../types";
import { ButtonIcon } from "../../Buttons";
import { FormField } from "../forms";
import { FormTextArea } from "./FormTextArea";

import * as closeIcon from "../../../../assets/img/inline_icons/round_close.svg";
import * as plusIcon from "../../../../assets/img/inline_icons/round_plus.svg";

import * as styles from "./FormCategoryDistribution.module.scss";

interface IProps {
  className?: string;
  name: string;
  label?: string;
  selectedCategory?: { name: string; percentage: number };
}

interface IInternalProps {
  addField: () => void;
  removeField: () => void;
  isLastElement: boolean;
  placeholder: string;
  isFirstElement: boolean;
}

const SingleCategoryDistributionComponent: React.SFC<IProps & IInternalProps> = props => {
  const { isFirstElement, removeField, isLastElement, placeholder, addField } = props;
  return (
    <Row>
      <Col xs={8}>
        <Row className="justify-content-center">
          <Col xs={1} className="pl-4 pt-2">
            {isLastElement && (
              <ButtonIcon
                svgIcon={plusIcon}
                onClick={() => {
                  addField();
                }}
              />
            )}
          </Col>
          <Col>
            <FormField
              name={`${props.name}.description`}
              className={styles.containerWidget}
              placeholder={placeholder}
            />
          </Col>
        </Row>
      </Col>
      <Col>
        <Row>
          <Col xs={9}>
            <FormField
              prefix="%"
              name={`${props.name}.percent`}
              className={styles.containerWidget}
            />
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

export class FormCategoryDistribution extends React.Component<IProps & CommonHtmlProps> {
  static contextTypes = {
    formik: PropTypes.object,
  };

  render(): React.ReactNode {
    const { name, label, className } = this.props;
    const { setFieldValue, values } = this.context.formik as FormikProps<any>;
    const blankField = {
      description: "",
      percent: 0,
    };
    const categoryDistribution = values[name] || [];

    if (!categoryDistribution.length) setFieldValue(name, [blankField]);

    return (
      <Col className={cn(styles.containerWidget, className)}>
        <Row>
          <Col>
            <div className="p-4">{label}</div>
          </Col>
        </Row>
        <FormTextArea name="useOfCapital" placeholder="Detail" className={styles.textArea} />

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
                      name={`${name}.${index}`}
                      removeField={() => arrayHelpers.remove(index)}
                      placeholder="Enter"
                      addField={() => arrayHelpers.push(blankField)}
                      isFirstElement={isFirstElement}
                      isLastElement={isLastElement}
                    />
                  );
                },
              )}
            </>
          )}
        />
      </Col>
    );
  }
}
