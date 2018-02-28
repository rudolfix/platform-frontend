import * as React from "react";
import { Button, Input } from "reactstrap";
import { actions } from "../../modules/actions";
import { selectIsUnlocked } from "../../modules/web3/reducer";
import { appConnect } from "../../store";

interface IState {
  password: string;
}

interface IStateProps {
  isUnlocked: boolean;
}

interface IDispatchProps {
  onCancel: () => void;
  onAccept: (password?: string) => void;
}

export class LightWalletSignPromptComponent extends React.Component<
  IDispatchProps & IStateProps,
  IState
> {
  constructor(props: IDispatchProps & IStateProps) {
    super(props);
    this.state = {
      password: "",
    };
  }

  private passwordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      password: e.target.value,
    });
  };

  render(): React.ReactNode {
    const { onAccept, onCancel } = this.props;

    return (
      <div>
        <p>Light wallet sign!</p>

        {!this.props.isUnlocked && (
          <Input
            placeholder="password"
            type="password"
            onChange={this.passwordChange}
            value={this.state.password}
          />
        )}

        <Button onClick={() => onAccept(this.state.password)}>Accept</Button>
        <Button onClick={onCancel}>Reject</Button>
      </div>
    );
  }
}

export const LightWalletSignPrompt = appConnect<IStateProps, IDispatchProps>({
  stateToProps: s => ({
    isUnlocked: selectIsUnlocked(s.web3State),
  }),
  dispatchToProps: dispatch => ({
    onAccept: (password?: string) => dispatch(actions.signMessageModal.accept(password)),
    onCancel: () => dispatch(actions.signMessageModal.hide()),
  }),
})(LightWalletSignPromptComponent);
