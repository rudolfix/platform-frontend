import * as React from "react";
import { Col, Row } from "reactstrap";

import { FormattedMessage } from "react-intl";
import { LayoutAuthorized } from "./layouts/LayoutAuthorized";
import { DocumentTile } from "./shared/Document";
import { SectionHeader } from "./shared/SectionHeader";

const documents = [
  {
    title: "example pdf",
    url: "example.pdf",
  },
  {
    title: "example doc",
    url: "example.doc",
  },
  {
    title: "example",
    url: "example.docx",
  },
];

export const Documents: React.SFC = () => (
  <LayoutAuthorized>
    <Row>
      <Col xs={12} md={7}>
        <SectionHeader className="my-4">
          <FormattedMessage id="documents.templates" />
        </SectionHeader>

        <Row>
          {documents.map(({ title, url }) => (
            <Col xs={6} md={4} key={url} className="mb-4">
              <DocumentTile title={title} extension={url} />
            </Col>
          ))}
        </Row>

        <SectionHeader className="my-4">
          <FormattedMessage id="documents.need-to-upload-these-files" />
        </SectionHeader>

        <Row>
          {documents.map(({ title, url }) => (
            <Col xs={6} md={4} key={url} className="mb-4">
              <DocumentTile title={title} extension={url} />
            </Col>
          ))}
        </Row>

        <SectionHeader className="my-4">
          <FormattedMessage id="documents.marketing-files" />
        </SectionHeader>

        <Row>
          {documents.map(({ title, url }) => (
            <Col xs={6} md={4} key={url} className="mb-4">
              <DocumentTile title={title} extension={url} />
            </Col>
          ))}
        </Row>
      </Col>
      <Col xs={12} md={5}>
        <SectionHeader className="my-4">
          <FormattedMessage id="documents.automatically-generated-files" />
        </SectionHeader>

        <Row>
          {documents.map(({ title, url }) => (
            <Col xs={6} key={url} className="mb-4">
              <DocumentTile title={title} extension={url} />
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  </LayoutAuthorized>
);
