import React, { useEffect } from "react";
import { WorkspaceCreationErrorView } from "./WorkspaceCreationErrorView/WorkspaceCreationErrorView";
import { RQButton } from "lib/design-system-v2/components";
import { useOpenLocalWorkspace } from "features/workspaces/hooks/useOpenLocalWorkspace";
import { trackLocalWorkspaceCreationConflictShown } from "modules/analytics/events/common/teams";
import { displayFolderSelector } from "components/mode-specific/desktop/misc/FileDialogButton";
import { useWorkspaceCreationContext } from "componentsV2/modals/CreateWorkspaceModal/context";
import { checkIsWorkspacePathAvailable } from "services/fsManagerServiceAdapter";
import { getAppMessage } from "i18n";

interface Props {
  path: string;
  analyticEventSource: string;
  onValidFolderSelection: () => void;
  onOpenWorkspaceSuccess?: () => void;
}

export const ExistingWorkspaceConflictView: React.FC<Props> = ({
  path,
  analyticEventSource,
  onValidFolderSelection,
  onOpenWorkspaceSuccess,
}) => {
  const { setFolderPath } = useWorkspaceCreationContext();
  const { openWorkspace, isLoading: isOpeningWorkspaceLoading } = useOpenLocalWorkspace({
    analyticEventSource,
    onOpenWorkspaceCallback: () => {
      onOpenWorkspaceSuccess?.();
    },
  });

  const handleChooseAnotherFolder = () => {
    displayFolderSelector(async (selectedFolderPath: string) => {
      setFolderPath(selectedFolderPath);
      const isChosenFolderEligible = await checkIsWorkspacePathAvailable(selectedFolderPath);
      if (!isChosenFolderEligible) {
        return;
      }
      onValidFolderSelection();
    });
  };

  useEffect(() => {
    trackLocalWorkspaceCreationConflictShown("config_exists_create_new_attempted", analyticEventSource);
  }, [analyticEventSource]);

  return (
    <>
      <WorkspaceCreationErrorView
        title={getAppMessage("workspace.conflictTitle")}
        description={getAppMessage("workspace.conflictDescription")}
        path={path}
        actions={
          <>
            <RQButton onClick={handleChooseAnotherFolder}>{getAppMessage("workspace.chooseAnotherFolder")}</RQButton>
            <RQButton type="primary" onClick={() => openWorkspace(path)} loading={isOpeningWorkspaceLoading}>
              {getAppMessage("workspace.useExistingWorkspace")}
            </RQButton>
          </>
        }
      />
    </>
  );
};
