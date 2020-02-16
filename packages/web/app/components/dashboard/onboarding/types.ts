export type TOnboardingStepData = {
  key: string;
  conditionCompleted: boolean;
  title: JSX.Element | string;
  component: JSX.Element | string;
};

export enum EOnboardingStepState {
  DONE = "done",
  ACTIVE = "active",
  NOT_DONE = "notDone",
}

export type TStepComponentProps = {
  key: string;
  stepState: EOnboardingStepState;
  title: JSX.Element | string;
  component: JSX.Element | string;
  number: number;
  isLast: boolean;
};
