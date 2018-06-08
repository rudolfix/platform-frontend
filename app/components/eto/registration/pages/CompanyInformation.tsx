import { FormikProps, withFormik } from "formik";
import * as React from "react";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { EtoCompanyInformationType, TPartialEtoData } from "../../../../lib/api/EtoApi.interfaces";
import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { onEnterAction } from "../../../../utils/OnEnterAction";
import { Accordion, AccordionElement } from "../../../shared/Accordion";
import { Button } from "../../../shared/Buttons";
import { FormTextArea } from "../../../shared/forms/formField/FormTextArea";
import { FormField } from "../../../shared/forms/forms";
import { SingleFileUpload } from "../../../shared/SingleFileUpload";
import { EtoTagWidget, generateTagOptions } from "../../shared/EtoTagWidget";
import { EtoFormBase } from "../EtoFormBase";
import { Section } from "../Shared";

interface IStateProps {
  loadingData: boolean;
  stateValues: TPartialEtoData;
}

interface IDispatchProps {
  submitForm: (values: TPartialEtoData) => void;
}

const tagList = ["Science", "Technology", "Blockchain", "Medical", "Research"];

type IProps = IStateProps & IDispatchProps;

const EtoForm = (props: FormikProps<TPartialEtoData>) => {
  return (
    <EtoFormBase title="Company Information" validator={EtoCompanyInformationType.toYup()}>
      <Section>
        <FormField label="Brand Name*" name="brandName" />
        <FormField label="Website*" name="website" />
        <FormField label="Company tagline*" name="companyTagline" />
        <FormTextArea
          className="mb-2 mt-2"
          label="Company Description*"
          placeholder="Describe your company 250 Characters"
          name="companyDescription"
        />
        <FormTextArea
          label="Founders Quote"
          placeholder="Key Quote from Founder 250 Characters"
          name="foundersQuote"
        />
        <FormTextArea
          label="Founders Investor"
          placeholder="Key Quote from Investor 250 Characters"
          name="keyQuoteFromInvestor"
        />

        <EtoTagWidget
          selectedTagsLimit={5}
          options={generateTagOptions(tagList)}
          name="tags"
          className="mb-4"
        />

        <SingleFileUpload
          acceptedFiles="image/*"
          fileUploading={false}
          filesLoading={false}
          fileFormatInformation="*150 x 150 png"
          uploadCta="Upload logo"
          files={[]}
          onDropFile={() => {}}
          className="mb-3"
        />
        <SingleFileUpload
          acceptedFiles="image/*"
          fileUploading={false}
          filesLoading={false}
          fileFormatInformation="*550 x 300 png"
          uploadCta="Upload Teaser Image"
          files={[]}
          onDropFile={() => {}}
          className="mb-3"
        />
        <SingleFileUpload
          acceptedFiles="image/*"
          fileUploading={false}
          filesLoading={false}
          fileFormatInformation="*1250 x 400 png"
          uploadCta="Upload Banner"
          files={[]}
          onDropFile={() => {}}
          className="mb-3"
        />
        {/* TODO: Use backend connected SingleFileUpload currently are only place holders */}
      </Section>
      <Col>
        <Row className="justify-content-end">
          <Button
            layout="primary"
            className="mr-4"
            onClick={() => {
              // tslint:disable-next-line
              console.log("Form values: ", props.values);
              props.submitForm();
            }}
          >
            Save
          </Button>
        </Row>
      </Col>
    </EtoFormBase>
  );
};

const EtoEnhancedForm = withFormik<IProps, TPartialEtoData>({
  validationSchema: EtoCompanyInformationType.toYup(),
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
