import * as React from 'react';
import * as ethIcon from '../../../assets/img/eth_icon.svg';
import * as moneyIcon from '../../../assets/img/nEUR_icon.svg';
import { ButtonSecondary } from '../../shared/Buttons';
import { MoneySuiteWidget } from '../../shared/MoneySuiteWidget';
import { IPanelDarkProps, PanelDark } from '../../shared/PanelDark';
import { TotalEuro } from '../TotalEuro';
import * as styles from './WalletBalance.module.scss';

export enum WalletBalanceTheme {
    light = 't-light',
    dark = 't-dark'
}

interface IChartProps {
    radius: number;
    moneyValueOne: number;
    moneyValueTwo: number;
}

interface IWalletBalance {
    totalEurValue: string;
    theme: WalletBalanceTheme;
}

const Chart: React.SFC<IChartProps> = ({ radius, moneyValueOne, moneyValueTwo }) => {
    if (moneyValueOne === 0 && moneyValueTwo === 0) {
        moneyValueOne = moneyValueTwo = 1;
    }

    const chartRadius = radius * 0.5;
    const circumference = 2 * Math.PI * chartRadius;
    const totalWalletsValue = moneyValueOne + moneyValueTwo;
    const walletValueProportion = moneyValueOne / totalWalletsValue * circumference;

    return (
        <svg className={styles.chart} width="100%" height="100%" viewBox={`0 0 ${radius * 2} ${radius * 2}`}>
            <clipPath id="chart-circle-clip-path">
                <path d="M75,150 C33.5786438,150 0,116.421356 0,75 C0,33.5786438 33.5786438,0 75,0 C116.421356,0 150,33.5786438 150,75 C150,116.421356 116.421356,150 75,150 Z M75,113 C95.9868205,113 113,95.9868205 113,75 C113,54.0131795 95.9868205,37 75,37 C54.0131795,37 37,54.0131795 37,75 C37,95.9868205 54.0131795,113 75,113 Z" />
            </clipPath>
            <g clipPath="url(#chart-circle-clip-path)">
                <circle fill="#E3EAF5" cx={radius} cy={radius} r={radius} />
                <circle
                    strokeDasharray={`${walletValueProportion} ${circumference}`}
                    stroke="#394651"
                    strokeWidth={radius}
                    cx={radius}
                    cy={radius}
                    r={chartRadius}
                />
            </g>
        </svg>
    );
};

export const WalletBalance: React.SFC<IPanelDarkProps & IChartProps & IWalletBalance> = ({
    radius,
    moneyValueOne,
    moneyValueTwo,
    headerText,
    totalEurValue,
    theme
}) => (
    <div className={`${styles.walletBalance} ${theme}`}>
        <PanelDark headerText={headerText} rightComponent={<TotalEuro totalEurValue={totalEurValue} />}>
            <div className={styles.walletBalanceWrapper}>
                <Chart radius={radius} moneyValueOne={moneyValueOne} moneyValueTwo={moneyValueTwo} />
                <div className={`${styles.walletBalanceActions}`}>
                    <div className={styles.moneySuiteWrapper}>
                        <MoneySuiteWidget
                            currency="eur_token"
                            largeNumber={`${moneyValueOne}`}
                            icon={moneyIcon}
                            data-test-id="euro-widget"
                            value={`6004904646${'0'.repeat(16)}`}
                            percentage={'0'}
                        />
                        <div className={styles.buttonsWrapper}>
                            <ButtonSecondary>Withdraw funds ></ButtonSecondary>
                            <ButtonSecondary>Deposit funds ></ButtonSecondary>
                        </div>
                    </div>
                    <div className={styles.moneySuiteWrapper}>
                        <MoneySuiteWidget
                            currency="eth"
                            largeNumber={`${moneyValueTwo}`}
                            icon={ethIcon}
                            data-test-id="euro-widget"
                            value={'6004904646' + '0'.repeat(16)}
                            percentage={'-500'}
                        />
                        <div className={styles.buttonsWrapper}>
                            <ButtonSecondary>Withdraw funds ></ButtonSecondary>
                            <ButtonSecondary>Deposit funds ></ButtonSecondary>
                        </div>
                    </div>
                </div>
            </div>
        </PanelDark>
    </div>
);
