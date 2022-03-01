import { FC } from "react";
import ActionButton from "../../../../controls/ActionButton";

interface ActionButtonsGroupProps {
  disabled: boolean;
  onAcceptApplication: () => Promise<void>;
  onUpdateApplicationStatus: (status: string) => Promise<void>;
}

const ActionButtonsGroup: FC<ActionButtonsGroupProps> = ({
  disabled,
  onAcceptApplication,
  onUpdateApplicationStatus,
}) => (
  <>
    <div className="my-1">
      <ActionButton disabled={disabled} onClick={onAcceptApplication}>
        Accept
      </ActionButton>
    </div>

    <div className="my-1">
      <ActionButton
        disabled={disabled}
        onClick={() => onUpdateApplicationStatus("closed")}
        additionalClassName="bg-amber-600 hover:bg-amber-700 active:bg-amber-600 border-amber-800"
      >
        Close
      </ActionButton>
    </div>

    <div className="my-1">
      <ActionButton
        disabled={disabled}
        onClick={() => onUpdateApplicationStatus("pending")}
        additionalClassName="bg-slate-500 hover:bg-slate-600 active:bg-slate-500 border-slate-800"
      >
        Re-open
      </ActionButton>
    </div>
  </>
);

export default ActionButtonsGroup;
