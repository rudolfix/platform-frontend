import * as React from "react";
import { compose, withProps } from "recompose";

import { ENomineeTask, getNomineeTasks, ITask, NomineeTasksData } from "./NomineeTasksData";

interface IDashboardProps {
  nomineeTasks: ITask[];
}

interface IExternalProps {
  nomineeTaskStep: ENomineeTask;
}

const NomineeDashboardTasksLayout: React.FunctionComponent<IDashboardProps> = ({
  nomineeTasks,
}) => (
  <>
    {nomineeTasks.map(({ taskRootComponent: TaskRootComponent, key }: ITask) => (
      <TaskRootComponent key={key} />
    ))}
  </>
);

export const NomineeDashboardTasks = compose<IDashboardProps, IExternalProps>(
  withProps<IDashboardProps, IExternalProps>(({ nomineeTaskStep }) => ({
    nomineeTasks: getNomineeTasks(NomineeTasksData, nomineeTaskStep),
  })),
)(NomineeDashboardTasksLayout);