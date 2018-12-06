import * as React from "react";
import { Helmet } from "react-helmet";

import { TTranslatedString } from "../types";
import { IIntlHelpers, IIntlProps, injectIntlHelpers } from "./injectIntlHelpers";

type TMetaTags = {
  title: TTranslatedString;
  root?: boolean;
};

const withMetaTags = <T extends any>(
  getMetaTags: (props: T, intl: IIntlHelpers) => TMetaTags,
  root: boolean = false,
) => (Wrapper: React.ComponentType<T>) =>
  injectIntlHelpers(({ intl, ...props }: IIntlProps & any) => {
    const { title } = getMetaTags(props, intl);

    return (
      <>
        <Helmet titleTemplate={root ? undefined : "%s - Neufund Platform"}>
          {title && <title>{title}</title>}
        </Helmet>

        <Wrapper {...props} />
      </>
    );
  });

const withRootMetaTag = () => (Wrapper: React.ComponentType<any>) => (props: any) => {
  return (
    <>
      <Helmet>
        <title>Neufund Platform</title>
      </Helmet>

      <Wrapper {...props} />
    </>
  );
};

export { withMetaTags, withRootMetaTag };
