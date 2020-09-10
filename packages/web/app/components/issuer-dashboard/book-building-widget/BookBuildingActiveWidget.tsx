import { Button, EButtonLayout } from "@neufund/design-system";
import { IBookBuildingStats } from "@neufund/shared-modules";
import { DAY } from "@neufund/shared-utils";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";

import { EColumnSpan } from "../../layouts/Container";
import { DashboardWidget } from "../../shared/dashboard-widget/DashboardWidget";
import { BookBuildingStats } from "./BookBuildingStats";

type TExternalProps = {
  bookBuildingStats: IBookBuildingStats;
  columnSpan: EColumnSpan | undefined;
  downloadCSV: () => void;
  etoId: string;
  maxPledges: number | null;
  minOffsetPeriod: number;
  stopBookBuilding: (etoId: string) => void;
};

const BookBuildingActiveWidget: React.FunctionComponent<TExternalProps> = ({
  bookBuildingStats,
  columnSpan,
  downloadCSV,
  etoId,
  maxPledges,
  minOffsetPeriod,
  stopBookBuilding,
}) => (
  <DashboardWidget
    title={<FormattedMessage id="settings.book-building-widget.book-building-enabled" />}
    text={
      <FormattedHTMLMessage
        tagName="span"
        id="settings.book-building-widget.book-building-enabled-text"
        values={{ minOffsetPeriod: minOffsetPeriod / DAY }}
      />
    }
    columnSpan={columnSpan}
  >
    <BookBuildingStats
      bookBuildingStats={bookBuildingStats}
      downloadCSV={downloadCSV}
      maxPledges={maxPledges}
    />

    <div className="m-auto">
      <Button
        layout={EButtonLayout.PRIMARY}
        type="button"
        onClick={() => stopBookBuilding(etoId)}
        data-test-id="eto-flow-start-bookbuilding"
      >
        <FormattedMessage id="settings.book-building-widget.stop-book-building" />
      </Button>
    </div>
  </DashboardWidget>
);

export { BookBuildingActiveWidget };
