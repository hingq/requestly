import { useState } from "react";
import { useSelector } from "react-redux";
import { Checkbox, Input } from "antd";
import { CreateWorkspaceFooter } from "../CreateWorkspaceFooter/CreateWorkspaceFooter";
import { CreateWorkspaceArgs } from "features/workspaces/hooks/useCreateWorkspace";
import "./sharedWorkspaceCreationView.scss";
import { getUserAuthDetails } from "store/slices/global/user/selectors";
import { getDomainFromEmail } from "utils/FormattingHelper";
import { WorkspaceType } from "features/workspaces/types";
import { useWorkspaceCreationContext } from "../../context";
import { getAppMessage } from "i18n";

export const SharedWorkspaceCreationView = ({
  onCreateWorkspaceClick,
  isLoading,
  onCancel,
}: {
  onCreateWorkspaceClick: (args: CreateWorkspaceArgs) => void;
  isLoading: boolean;
  onCancel: () => void;
}) => {
  const user = useSelector(getUserAuthDetails);
  const { workspaceName, setWorkspaceName } = useWorkspaceCreationContext();

  const [isNotifyAllSelected, setIsNotifyAllSelected] = useState(false);

  const handleOnCreateWorkspaceClick = () => {
    onCreateWorkspaceClick({
      workspaceType: WorkspaceType.SHARED,
      workspaceName,
      isNotifyAllSelected,
    });
  };

  return (
    <>
      <div className="create-workspace-header">
        <div className="create-workspace-header__title">{getAppMessage("workspace.teamWorkspaceCreateTitle")}</div>
        <div className="create-workspace-header__description">
          {getAppMessage("workspace.teamWorkspaceCreateDescription")}
        </div>
        <label htmlFor="workspace-name" className="create-workspace-header__label">
          {getAppMessage("workspace.workspaceName")}
        </label>
        <Input
          autoFocus
          value={workspaceName}
          id="workspace-name"
          className="create-workspace-header__input"
          onChange={(e) => setWorkspaceName(e.target.value)}
        />
      </div>
      <div className="invite-all-domain-users-container">
        <Checkbox checked={isNotifyAllSelected} onChange={() => setIsNotifyAllSelected(!isNotifyAllSelected)} />{" "}
        <span className="invite-all-domain-users-text">
          {getAppMessage(
            "workspace.notifyDomainUsers",
            (domain: string) => `通知 ${domain} 的所有用户加入此工作区。`
          )(getDomainFromEmail(user.details?.profile?.email))}
        </span>
      </div>
      <CreateWorkspaceFooter
        onCancel={onCancel}
        onCreateWorkspaceClick={handleOnCreateWorkspaceClick}
        isLoading={isLoading}
        disabled={!workspaceName.length}
      />
    </>
  );
};
