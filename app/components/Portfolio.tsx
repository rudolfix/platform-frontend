import * as React from 'react'
import { Col, Row } from 'reactstrap';

import { FormattedMessage } from 'react-intl';
import { LayoutAuthorized } from './layouts/LayoutAuthorized';
import { SectionHeader } from './shared/SectionHeader';

export const Portfolio: React.SFC = () => (
  <LayoutAuthorized>
    <SectionHeader layoutHasDecorator={false} className="mb-4">
      <FormattedMessage id="portfolio.section.asset-portfolio.title" />
    </SectionHeader>
    <Row>
      <Col className="mb-4">
      </Col>
    </Row>

    <SectionHeader layoutHasDecorator={false} className="mb-4">
      <FormattedMessage id="portfolio.section.dividends-from-neu.title" />
    </SectionHeader>
    <Row>
      <Col className="mb-4">

      </Col>
    </Row>

    <SectionHeader layoutHasDecorator={false} className="mb-4">
      <FormattedMessage id="portfolio.section.reserved-assets.title" />
    </SectionHeader>
    <Row>
      <Col className="mb-4">
      </Col>
    </Row>

    <SectionHeader layoutHasDecorator={false} className="mb-4">
      <FormattedMessage id="portfolio.section.your-assets.title" />
    </SectionHeader>
    <Row>
      <Col className="mb-4">
      </Col>
    </Row>
  </LayoutAuthorized>
)
