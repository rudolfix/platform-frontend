import * as React from "react";
import { Input } from "reactstrap";
import { selectIsUnlocked } from "../../modules/web3/reducer";
import { appConnect } from "../../store";
import { ButtonPrimary, ButtonSecondary } from "../shared/Buttons";

interface IState {
  password: string;
}

interface IStateProps {
  isUnlocked: boolean;
}

interface IProps {
  onCancel: () => void;
  onAccept: (password?: string) => void;
}

export class LightWalletSignPromptComponent extends React.Component<IStateProps & IProps, IState> {
  constructor(props: IStateProps & IProps) {
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
        <div className="mt-3">
          <ButtonPrimary onClick={() => onAccept(this.state.password)}>Accept</ButtonPrimary>
          <ButtonSecondary onClick={onCancel}>Reject</ButtonSecondary>
        </div>
      </div>
    );
  }
}

export const LightWalletSignPrompt = appConnect<IStateProps>({
  stateToProps: s => ({
    isUnlocked: selectIsUnlocked(s.web3State),
  }),
})(LightWalletSignPromptComponent);
