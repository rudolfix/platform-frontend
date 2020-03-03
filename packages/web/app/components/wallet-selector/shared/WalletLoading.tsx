import * as React from "react";

import { LoadingIndicator } from "../../shared/loading-indicator/LoadingIndicator";

import * as styles from "./RegisterWalletSelector.module.scss";

export const WalletLoading = () => <LoadingIndicator className={styles.loadingIndicator} />;
