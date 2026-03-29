import React, { useEffect } from "react";
import { RQButton } from "lib/design-system-v2/components";
import { WorkspaceCreationErrorView } from "./WorkspaceCreationErrorView/WorkspaceCreationErrorView";
import { displayFolderSelector } from "components/mode-specific/desktop/misc/FileDialogButton";
import { trackLocalWorkspaceCreationConflictShown } from "modules/analytics/events/common/teams";
import { useWorkspaceCreationContext } from "componentsV2/modals/CreateWorkspaceModal/context";
import { getAppMessage } from "i18n";

interface Props {
  path: string;
  onNewWorkspaceClick: () => void;
  openWorkspace: (workspacePath: string) => void;
  isOpeningWorkspaceLoading: boolean;
  analyticEventSource: string;
}

export const OpenWorkspaceErrorView: React.FC<Props> = ({
  path,
  onNewWorkspaceClick,
  openWorkspace,
  isOpeningWorkspaceLoading,
  analyticEventSource,
}) => {
  const { setFolderPath } = useWorkspaceCreationContext();

  useEffect(() => {
    trackLocalWorkspaceCreationConflictShown("config_missing_open_existing_attempted", analyticEventSource);
  }, [analyticEventSource]);

  return (
    <>
      <WorkspaceCreationErrorView
        title={getAppMessage("workspace.openErrorTitle")}
        description={getAppMessage("workspace.openErrorDescription")}
        path={path}
        actions={
          <>
            <RQButton
              onClick={() => {
                setFolderPath(path);
                onNewWorkspaceClick();
              }}
            >
              {getAppMessage("workspace.createWorkspaceHere")}
            </RQButton>
            <RQButton
              type="primary"
              onClick={() => displayFolderSelector((folderPath: string) => openWorkspace(folderPath))}
              loading={isOpeningWorkspaceLoading}
            >
              {getAppMessage("workspace.selectAnotherFolder")}
            </RQButton>
          </>
        }
      />
    </>
  );
};
