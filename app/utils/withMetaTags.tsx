import * as React from "react";
import { Helmet } from "react-helmet";

import { IIntlHelpers, IIntlProps, injectIntlHelpers } from "./injectIntlHelpers";

type TMetaTags = {
  title: string;
};

const withMetaTags = <T extends {}>(getMetaTags: (props: T, intl: IIntlHelpers) => TMetaTags) => (
  Wrapper: React.ComponentType<T>,
) =>
  injectIntlHelpers<T>(({ intl, ...props }: IIntlProps & any) => {
    const { title } = getMetaTags(props, intl);

    return (
      <>
        <Helmet titleTemplate="%s - Neufund Platform">{title && <title>{title}</title>}</Helmet>

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
