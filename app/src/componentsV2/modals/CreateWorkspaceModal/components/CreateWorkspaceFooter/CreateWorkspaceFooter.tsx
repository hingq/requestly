import { RQButton } from "lib/design-system-v2/components";
import "./createWorkspaceFooter.scss";
import { Tooltip } from "antd";
import { getAppMessage } from "i18n";

interface CreateWorkspaceFooterProps {
  onCancel: () => void;
  onCreateWorkspaceClick: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const CreateWorkspaceFooter = ({
  onCancel,
  onCreateWorkspaceClick,
  isLoading,
  disabled,
}: CreateWorkspaceFooterProps) => {
  return (
    <>
      <div className="create-workspace-footer">
        <RQButton onClick={onCancel}>{getAppMessage("common.cancel")}</RQButton>
        <Tooltip
          title={disabled ? getAppMessage("workspace.completeRequiredFields") : null}
          color="#000"
          placement="top"
        >
          <div>
            <RQButton type="primary" onClick={onCreateWorkspaceClick} loading={isLoading} disabled={disabled}>
              {getAppMessage("workspace.createNewWorkspace")}
            </RQButton>
          </div>
        </Tooltip>
      </div>
    </>
  );
};
