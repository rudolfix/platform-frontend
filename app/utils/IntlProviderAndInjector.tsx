import * as PropTypes from "prop-types";
import * as React from "react";
import { IntlProvider } from "react-intl";

import { Container } from "inversify";
import * as languageEn from "../../intl/locales/en-en.json";
import { symbols } from "../di/symbols";
import { IntlWrapper } from "../lib/intl/IntlWrapper";
import { IIntlProps, injectIntlHelpers } from "./injectIntlHelpers";

const IntlContainerInjector = injectIntlHelpers<{}>(
  class extends React.Component<IIntlProps> {
    static contextTypes = {
      container: PropTypes.object,
    };
    static displayName = "IntlContainerInjector";

    private container: Container = this.context.container;

    componentWillMount(): void {
      this.container.get<IntlWrapper>(symbols.intlWrapper).intl = this.props.intl;
    }

    render(): React.ReactNode {
      return this.props.children;
    }
  },
);

/**
 * Provides intl to children and injects it to inversify container that should be available via context.
 */
export const IntlProviderAndInjector: React.SFC = ({ children }) => (
  // change locale to gb to have european date format everywhere
  <IntlProvider locale="en-gb" messages={languageEn} textComponent={React.Fragment}>
    <IntlContainerInjector>{children}</IntlContainerInjector>
  </IntlProvider>
);
