import { useCallback, useEffect, useRef, useState } from "react";
import { Input, Tooltip } from "antd";
import { MdOutlineFolder } from "@react-icons/all-files/md/MdOutlineFolder";
import { MdOutlineInsertDriveFile } from "@react-icons/all-files/md/MdOutlineInsertDriveFile";
import { CreateWorkspaceFooter } from "../CreateWorkspaceFooter/CreateWorkspaceFooter";
import { displayFolderSelector } from "components/mode-specific/desktop/misc/FileDialogButton";
import { PiFolderOpen } from "@react-icons/all-files/pi/PiFolderOpen";
import Logger from "lib/logger";
import { RQButton } from "lib/design-system-v2/components";
import { CreateWorkspaceArgs } from "features/workspaces/hooks/useCreateWorkspace";
import { MdOutlineInfo } from "@react-icons/all-files/md/MdOutlineInfo";
import "./localWorkspaceCreationView.scss";
import { WorkspaceType } from "features/workspaces/types";
import { useDebounce } from "hooks/useDebounce";
import { WorkspacePathEllipsis } from "features/workspaces/components/WorkspacePathEllipsis";
import { LocalWorkspaceCreateOptions } from "./components/LocalWorkspaceCreateOptions/LocalWorkspaceCreateOptions";
import { useOpenLocalWorkspace } from "features/workspaces/hooks/useOpenLocalWorkspace";
import { FileSystemError } from "features/apiClient/helpers/modules/sync/local/services/types";
import { OpenWorkspaceErrorView } from "./components/OpenWorkspaceErrorView";
import { useWorkspaceCreationContext } from "../../context";
import { checkIsWorkspacePathAvailable } from "services/fsManagerServiceAdapter";
import { ExistingWorkspaceConflictView } from "./components/ExistingWorkspaceConflictView";
import { isFeatureCompatible } from "utils/CompatibilityUtils";
import FEATURES from "config/constants/sub/features";
import { toast } from "utils/Toast";
import { IoMdArrowBack } from "@react-icons/all-files/io/IoMdArrowBack";
import { MdInfoOutline } from "@react-icons/all-files/md/MdInfoOutline";
import { getAppMessage } from "i18n";

type FolderItem = {
  name: string;
  path: string;
} & (
  | {
      type: "directory";
      contents: FolderItem[];
    }
  | { type: "file" }
);

interface FolderPreview {
  success: boolean;
  folderPath: string;
  existingContents: FolderItem[];
  newAdditions: FolderItem;
}

const PreviewItem = ({ item, isNewWorkspace = false }: { item: FolderItem; isNewWorkspace?: boolean }) => {
  const Icon = item.type === "directory" ? MdOutlineFolder : MdOutlineInsertDriveFile;

  return (
    <div key={item.path} className={`preview-folder-items__item ${isNewWorkspace ? "new-workspace-item" : ""}`}>
      <div className="preview-folder-item-content">
        <Icon className="preview-folder-item-icon" />
        <span className="preview-folder-item-name">{item.name}</span>
      </div>
    </div>
  );
};

// eslint-disable-next-line no-control-regex
const INVALID_FS_NAME_CHARACTERS = /[<>:"/\\|?*\x00-\x1f]/g;

export const LocalWorkspaceCreationView = ({
  onCreateWorkspaceClick,
  onCancel,
  onSuccessCallback,
  isLoading,
  isOpenedInModal,
  analyticEventSource,
}: {
  onCreateWorkspaceClick: (args: CreateWorkspaceArgs) => void;
  onCancel: () => void;
  onSuccessCallback?: () => void;
  isLoading: boolean;
  isOpenedInModal?: boolean;
  analyticEventSource: string;
}) => {
  const { workspaceName, folderPath, setWorkspaceName, setFolderPath } = useWorkspaceCreationContext();

  const [folderPreview, setFolderPreview] = useState<FolderPreview | null>(null);
  const [hasDuplicateWorkspaceName, setHasDuplicateWorkspaceName] = useState(false);
  const [isCreationOptionsVisible, setIsCreationOptionsVisible] = useState(
    (isOpenedInModal && isFeatureCompatible(FEATURES.ONBOARDING_V2)) ?? false
  );
  const [openWorkspaceError, setOpenWorkspaceError] = useState<FileSystemError | null>(null);

  const [isSelectedFolderAvailable, setIsSelectedFolderAvailable] = useState(true);

  const { openWorkspace, isLoading: isOpenWorkspaceLoading } = useOpenLocalWorkspace({
    analyticEventSource: analyticEventSource,
    onOpenWorkspaceCallback: () => {
      onSuccessCallback?.();
    },
    onError: (error) => {
      if (!isFeatureCompatible(FEATURES.ONBOARDING_V2)) {
        toast.error(getAppMessage("errors.openWorkspaceFailed"));
        return;
      }
      setOpenWorkspaceError(error);
    },
  });

  const workspaceNameRef = useRef<string>(workspaceName);

  const folderSelectCallback = async (folderPath: string) => {
    setFolderPath(folderPath);
  };

  const handleOnCreateWorkspaceClick = () => {
    onCreateWorkspaceClick({
      workspaceType: WorkspaceType.LOCAL,
      workspaceName,
      folderPath,
    });
  };

  const renderPreviewItems = (items: FolderItem[], isNewAddition = false) => {
    return items.map((item) => (
      <div key={item.path}>
        <PreviewItem item={item} isNewWorkspace={isNewAddition} />
        {item.type === "directory" && item.contents.length > 0 && (
          <div className="workspace-folder-preview-content preview-folder-items">
            {renderPreviewItems(item.contents)}
          </div>
        )}
      </div>
    ));
  };

  const checkForDuplicateWorkspaceName = useCallback(
    (value: string) => {
      const workspaceName = value.replace(INVALID_FS_NAME_CHARACTERS, "-");
      const isDuplicate = folderPreview?.existingContents.find((item) => item.name === workspaceName);
      setHasDuplicateWorkspaceName(!!isDuplicate);
    },
    [folderPreview]
  );

  const debouncedCheckForDuplicateWorkspaceName = useDebounce(checkForDuplicateWorkspaceName);

  const handleWorkspaceNameChange = useCallback(
    (value: string) => {
      const newName = value.replace(INVALID_FS_NAME_CHARACTERS, "-");
      setWorkspaceName(newName);
      workspaceNameRef.current = newName;
      debouncedCheckForDuplicateWorkspaceName(newName);
    },
    [debouncedCheckForDuplicateWorkspaceName, setWorkspaceName]
  );

  useEffect(() => {
    window.RQ.DESKTOP.SERVICES.IPC.invokeEventInMain("get-workspace-folder-preview", {
      folderPath,
    })
      .then((result: FolderPreview) => {
        if (result.success) {
          setFolderPreview(result);
          setFolderPath(result.folderPath);
          if (isFeatureCompatible(FEATURES.ONBOARDING_V2)) {
            checkIsWorkspacePathAvailable(result.folderPath)
              .then((isEligible) => {
                setIsSelectedFolderAvailable(isEligible);
              })
              .catch(() => {
                setIsSelectedFolderAvailable(false);
              });
          }
        }
      })
      .catch((err: unknown) => {
        Logger.log("Could not get workspace folder preview data", err);
        // No OP
      });
  }, [folderPath, setFolderPreview, setFolderPath]);

  useEffect(() => {
    if (folderPreview) {
      checkForDuplicateWorkspaceName(workspaceNameRef.current);
    }
  }, [folderPreview, checkForDuplicateWorkspaceName]);

  if (openWorkspaceError) {
    return (
      <OpenWorkspaceErrorView
        path={openWorkspaceError.error.path}
        onNewWorkspaceClick={() => {
          setOpenWorkspaceError(null);
          setIsCreationOptionsVisible(false);
        }}
        openWorkspace={openWorkspace}
        isOpeningWorkspaceLoading={isOpenWorkspaceLoading}
        analyticEventSource="create_workspace_modal"
      />
    );
  }

  if (!isSelectedFolderAvailable) {
    return (
      <ExistingWorkspaceConflictView
        path={folderPath}
        onValidFolderSelection={() => {
          setIsSelectedFolderAvailable(true);
        }}
        analyticEventSource={analyticEventSource}
        onOpenWorkspaceSuccess={onSuccessCallback}
      />
    );
  }

  if (isCreationOptionsVisible) {
    return (
      <>
        <div className="create-workspace-header">
          <div className="create-workspace-header__title">{getAppMessage("workspace.addLocalWorkspace")}</div>
        </div>
        <div style={{ padding: "12px 0" }}>
          <LocalWorkspaceCreateOptions
            analyticEventSource={analyticEventSource}
            onCreateWorkspaceClick={() => {
              setOpenWorkspaceError(null);
              setIsCreationOptionsVisible(false);
            }}
            onCreationCallback={onSuccessCallback}
            openWorkspace={openWorkspace}
            isOpeningWorkspaceLoading={isOpenWorkspaceLoading}
            isOpenedInModal
          />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="create-workspace-header">
        <div className="create-workspace-header__title">
          {!isOpenedInModal ? <IoMdArrowBack onClick={onCancel} /> : null}
          {getAppMessage("workspace.createLocalWorkspace")}
        </div>

        <label
          htmlFor="workspace-folder-location"
          className="create-workspace-header__label workspace-folder-selector-label"
        >
          {getAppMessage("workspace.workspaceFolderLocation")}{" "}
          <Tooltip color="#000" placement="right" title={getAppMessage("workspace.workspaceFolderLocationHelp")}>
            <MdInfoOutline />
          </Tooltip>
        </label>
        <div className="workspace-folder-selector">
          <RQButton icon={<MdOutlineFolder />} onClick={() => displayFolderSelector(folderSelectCallback)}>
            {getAppMessage("workspace.selectFolder")}
          </RQButton>
          {folderPath.length ? <WorkspacePathEllipsis path={folderPath} className="selected-folder-path" /> : null}
        </div>
        <label htmlFor="workspace-name" className="create-workspace-header__label">
          {getAppMessage("workspace.workspaceName")}
        </label>
        <Input
          autoFocus
          value={workspaceName}
          id="workspace-name"
          className="create-workspace-header__input"
          onChange={(e) => handleWorkspaceNameChange(e.target.value)}
          status={hasDuplicateWorkspaceName ? "error" : undefined}
        />
        {hasDuplicateWorkspaceName ? (
          <div className="create-workspace-header__input-error-message">
            <MdInfoOutline />
            {getAppMessage("workspace.folderAlreadyExists")}
          </div>
        ) : null}
      </div>

      {folderPreview ? (
        <>
          <div className="workspace-folder-preview">
            <>
              <div className="preview-header">
                <div className="preview-title">{getAppMessage("workspace.preview")}</div>
                <div className="preview-path">
                  <PiFolderOpen /> {folderPreview.folderPath}
                </div>
              </div>
              <div className="workspace-folder-preview-content">
                <div className="workspace-folder-preview-content__new-additions-section preview-folder-items">
                  <Tooltip title={getAppMessage("workspace.previewInfo")} color="#000">
                    <MdOutlineInfo className="preview-info-icon" />
                  </Tooltip>
                  <PreviewItem
                    item={{
                      name: workspaceName || getAppMessage("workspace.workspacePlaceholderName"),
                      path: folderPath,
                      type: "directory",
                      contents: [],
                    }}
                    isNewWorkspace={true}
                  />
                  <div className="workspace-folder-preview-content preview-folder-items">
                    {folderPreview.newAdditions.type === "directory" &&
                      renderPreviewItems(folderPreview.newAdditions.contents, true)}
                  </div>
                </div>
                <div className="preview-folder-items existing-contents-section">
                  {renderPreviewItems(folderPreview.existingContents)}
                </div>
              </div>
            </>
          </div>
        </>
      ) : null}
      <CreateWorkspaceFooter
        onCancel={onCancel}
        onCreateWorkspaceClick={handleOnCreateWorkspaceClick}
        isLoading={isLoading}
        disabled={!workspaceName.length || !folderPath.length || hasDuplicateWorkspaceName}
      />
    </>
  );
};
