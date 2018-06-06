import { FieldArray, Form, FormikProps, withFormik } from "formik";
import * as React from "react";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { EtoTeamDataType, TPartialEtoData } from "../../../../lib/api/EtoApi.interfaces";
import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { onEnterAction } from "../../../../utils/OnEnterAction";
import { Accordion, AccordionElement } from "../../../shared/Accordion";
import { Button } from "../../../shared/Buttons";
import { FormTextArea } from "../../../shared/forms/formField/FormTextArea";
import { FormField, InlineFormField } from "../../../shared/forms/forms";
import { SingleFileUpload } from "../../../shared/SingleFileUpload";
import { Section } from "../Shared";

import * as plusIcon from "../../../../assets/img/inline_icons/plus.svg";

interface IStateProps {
  loadingData: boolean;
  stateValues: TPartialEtoData;
}

interface IDispatchProps {
  submitForm: (values: TPartialEtoData) => void;
}

type IProps = IStateProps & IDispatchProps;

const EtoForm = (props: FormikProps<TPartialEtoData>) => {
  // We are hitting tslint bug: https://github.com/palantir/tslint/issues/3540
  /* tslint:disable:no-useless-cast restrict-plus-operands */
  return (
    <Form>
      <Section line>
        <InlineFormField
          label="Number of employees (excluding founders):"
          placeholder="0"
          name="employeesAmount"
        />
      </Section>

      <Section line>
        <h4>Founders</h4>

        <FieldArray name="founders">
          {arrayHelpers => (
            <div>
              {props.values.founders!.map((_, index) => (
                <div key={index}>
                  <h5>#{index + 1}</h5>
                  <div className="p-4">
                    <FounderForm prefix={`founders.${index}`} />
                  </div>
                </div>
              ))}

              <Button
                layout="secondary"
                iconPosition="icon-before"
                svgIcon={plusIcon}
                type="button"
                onClick={() => arrayHelpers.push({})}
              >
                Add new founder
              </Button>
            </div>
          )}
        </FieldArray>
      </Section>

      <Section line>
        <h4>Cap Table</h4>

        <FieldArray name="capTable">
          {arrayHelpers => (
            <div>
              {props.values.capTable!.map((_, index) => (
                <div key={index}>
                  <h5>#{index + 1}</h5>
                  <div className="p-4">
                    <CapTableSubForm prefix={`capTable.${index}`} />
                  </div>
                </div>
              ))}

              <Button
                layout="secondary"
                iconPosition="icon-before"
                svgIcon={plusIcon}
                type="button"
                onClick={() => arrayHelpers.push({})}
              >
                Add new cap table entry
              </Button>
            </div>
          )}
        </FieldArray>
      </Section>

      <Section line>
        <h4>Notable Investors</h4>

        <FieldArray name="notableInvestors">
          {arrayHelpers => (
            <div>
              {props.values.notableInvestors!.map((_, index) => (
                <div key={index}>
                  <h5>#{index + 1}</h5>
                  <div className="p-4">
                    <PersonSubForm prefix={`notableInvestors.${index}`} />
                  </div>
                </div>
              ))}

              <Button
                layout="secondary"
                iconPosition="icon-before"
                svgIcon={plusIcon}
                onClick={() => arrayHelpers.push({})}
                type="button"
              >
                Add new notable investor
              </Button>
            </div>
          )}
        </FieldArray>
      </Section>

      <Section line>
        <h4>Advisors</h4>

        <FieldArray name="advisors">
          {arrayHelpers => (
            <div>
              {props.values.advisors!.map((_, index) => (
                <div key={index}>
                  <h5>#{index + 1}</h5>
                  <div className="p-4">
                    <PersonSubForm prefix={`advisors.${index}`} />
                  </div>
                </div>
              ))}

              <Button
                layout="secondary"
                iconPosition="icon-before"
                svgIcon={plusIcon}
                onClick={() => arrayHelpers.push({ fullName: "test" })}
                type="button"
              >
                Add new advisor
              </Button>
            </div>
          )}
        </FieldArray>
      </Section>

      <div className="text-center">
        <Button type="submit">
          {/*disabled={!formikBag.isValid || formikBag.loadingData}> */}
          Submit and continue
        </Button>
      </div>
    </Form>
  );
  /* tslint:enable */
};

interface ISubFormProps {
  prefix: string;
}

const FounderForm: React.SFC<ISubFormProps> = ({ prefix }) => (
  <>
    <FormField label="Full name" name={`${prefix}.fullName`} />
    <FormField label="Role" name={`${prefix}.role`} />
    <SingleFileUpload
      acceptedFiles="image/*"
      className="my-5"
      onDropFile={() => {}}
      files={[]}
      fileUploading={false}
      filesLoading={false}
      uploadCta="Add founder photo"
      fileFormatInformation=".jpg, .png"
    />
    <FormTextArea label="Short bio" name={`${prefix}.bio`} />
  </>
);

const CapTableSubForm: React.SFC<ISubFormProps> = ({ prefix }) => (
  <>
    <FormField label="Full name" name={`${prefix}.fullName`} />
    <FormField label="Ownership" placeholder="%" name={`${prefix}.ownership`} />
  </>
);

const PersonSubForm: React.SFC<ISubFormProps> = ({ prefix }) => (
  <>
    <FormField label="Full name" name={`${prefix}.fullName`} />
  </>
);

const EtoEnhancedForm = withFormik<IProps, TPartialEtoData>({
  validationSchema: EtoTeamDataType.toYup(),
  // isInitialValid: (props: IStateProps) => formikValidator(EtoTeamDataType)(props.stateValues),
  mapPropsToValues: props => props.stateValues,
  // enableReinitialize: true,
  handleSubmit: (values, props) => props.props.submitForm(values),
})(EtoForm);

export const EtoRegistrationTeamAndInvestorsComponent: React.SFC<IProps> = props => (
  <EtoEnhancedForm {...props} />
);

export const EtoRegistrationCompanyInformation = compose<React.SFC>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: s => ({
      loadingData: s.etoFlow.loading,
      stateValues: s.etoFlow.data,
    }),
    dispatchToProps: dispatch => ({
      submitForm: (data: any) => {
        dispatch(actions.etoFlow.loadData(data));
      },
    }),
  }),
  onEnterAction({
    actionCreator: _dispatch => {},
  }),
)(EtoRegistrationTeamAndInvestorsComponent);
