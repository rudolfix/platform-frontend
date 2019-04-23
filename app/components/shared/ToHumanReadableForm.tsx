import { findLast, floor } from "lodash";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

export enum EHumanReadableFormat {
  LONG = "long",
  SHORT = "short",
}

type TExternalProps = {
  number: number;
  format?: EHumanReadableFormat;
  divider?: number;
  children?: (range: number) => React.ReactNode;
};

enum ERangeKey {
  THOUSAND = "thousand",
  MILLION = "million",
}

type TRangeDescriptor = {
  divider: number;
  key: ERangeKey;
};

const ranges: TRangeDescriptor[] = [
  { divider: 1e3, key: ERangeKey.THOUSAND },
  { divider: 1e6, key: ERangeKey.MILLION },
];

const translationKeys = {
  [ERangeKey.MILLION]: {
    [EHumanReadableFormat.LONG]: (
      <FormattedMessage id="shared-component.to-human-readable-form.million.long" />
    ),
    [EHumanReadableFormat.SHORT]: (
      <FormattedMessage id="shared-component.to-human-readable-form.million.short" />
    ),
  },
  [ERangeKey.THOUSAND]: {
    [EHumanReadableFormat.LONG]: (
      <FormattedMessage id="shared-component.to-human-readable-form.thousand.long" />
    ),
    [EHumanReadableFormat.SHORT]: (
      <FormattedMessage id="shared-component.to-human-readable-form.thousand.short" />
    ),
  },
};

function getRange(number: number, divider?: number): TRangeDescriptor | undefined {
  if (divider) {
    return ranges.find(range => range.divider === divider);
  }

  return findLast(ranges, range => number / range.divider >= 1);
}

const ToHumanReadableForm: React.FunctionComponent<TExternalProps> = ({
  number,
  format = EHumanReadableFormat.LONG,
  children,
  divider,
}) => {
  const range = getRange(number, divider);

  if (range) {
    const value = floor(number / range.divider, 1);
    const translation = translationKeys[range.key][format];

    return (
      <>
        {value}
        {!children && (
          <>
            {format === EHumanReadableFormat.LONG && " "}
            {translation}
          </>
        )}
        {children && (
          <>
            {" - "}
            {children(range.divider)}
          </>
        )}
      </>
    );
  }

  return (
    <>
      {number.toString()}
      {children && (
        <>
          {" - "}
          {children(1)}
        </>
      )}
    </>
  );
};

export { ToHumanReadableForm };