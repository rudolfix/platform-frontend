import * as React from "react";
import { Helmet } from "react-helmet";

import {
  IIntlHelpers,
  IIntlProps,
  injectIntlHelpers,
} from "../components/shared/hocs/injectIntlHelpers.unsafe";

type TMetaTags = {
  title: string;
};

const withMetaTags = <T extends {}>(getMetaTags: (props: T, intl: IIntlHelpers) => TMetaTags) => (
  Wrapper: React.ComponentType<T>,
) =>
  injectIntlHelpers<T>((props: IIntlProps & T) => {
    const { title } = getMetaTags(props, props.intl);

    return (
      <>
        <Helmet titleTemplate="%s - Neufund Platform" title={title} />
        <Wrapper {...props} />
      </>
    );
  });

const withRootMetaTag = <T extends {}>() => (Wrapper: React.ComponentType<T>) => (props: T) => (
  <>
    <Helmet title="Neufund Platform" />

    <Wrapper {...props} />
  </>
);

export { withMetaTags, withRootMetaTag };
