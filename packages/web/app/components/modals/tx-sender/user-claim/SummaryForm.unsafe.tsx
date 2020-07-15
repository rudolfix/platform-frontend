import { Button } from "@neufund/design-system";
import { YupTS } from "@neufund/shared-modules";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Container, Row } from "reactstrap";

import { Form, FormFieldBoolean } from "../../../shared/forms";

const getSummaryFormSchema = () =>
  YupTS.object({
    readDocuments: YupTS.onlyTrue(),
  }).toYup();

type TSummaryFormValues = {
  readDocuments: boolean;
};

interface IExternalProps {
  onSubmit: () => void;
}

const SummaryForm: React.FunctionComponent<IExternalProps> = ({ onSubmit }) => (
  <Form<TSummaryFormValues>
    validationSchema={getSummaryFormSchema()}
    initialValues={{ readDocuments: false }}
    onSubmit={onSubmit}
  >
    {({ isValid }) => (
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} className="mb-3 d-flex justify-content-center">
            <FormFieldBoolean
              label={
                <FormattedMessage id="modals.tx-sender.user-claim-summary.download-confirmation" />
              }
              name="readDocuments"
            />
          </Col>
        </Row>
        <Row>
          <Col className="text-center">
            <Button
              disabled={!isValid}
              className="mt-2"
              onClick={onSubmit}
              data-test-id="modals.tx-sender.user-claim-flow.summary.accept"
            >
              <FormattedMessage id="general-flow.confirm" />
            </Button>
          </Col>
        </Row>
      </Container>
    )}
  </Form>
);

export { SummaryForm };
