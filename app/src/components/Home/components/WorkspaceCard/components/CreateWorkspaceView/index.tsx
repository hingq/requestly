import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUserAuthDetails } from "store/slices/global/user/selectors";
import { Col } from "antd";
import { RQButton } from "lib/design-system/components";
import { groupSvg } from "features/onboarding";
import { AuthConfirmationPopover } from "components/hoc/auth/AuthConfirmationPopover";
import { globalActions } from "store/slices/global/slice";
import { trackHomeWorkspaceActionClicked } from "components/Home/analytics";
import { SOURCE } from "modules/analytics/events/common/constants";
import "./index.scss";
import { getAppMessage } from "i18n";

export const CreateWorkspaceView: React.FC = () => {
  const user = useSelector(getUserAuthDetails);
  const dispatch = useDispatch();

  const handleCreateWorkspace = () => {
    trackHomeWorkspaceActionClicked("create_new_workspace");
    dispatch(
      globalActions.toggleActiveModal({
        modalName: "createWorkspaceModal",
        newValue: true,
        newProps: {
          source: SOURCE.HOME_SCREEN,
        },
      })
    );
  };

  return (
    <Col className="create-workspace-view">
      <img src={groupSvg} alt="workspace" />
      <div className="create-workspace-view-title">{getAppMessage("workspace.homeCardTitle")}</div>
      <div className="create-workspace-view-description">{getAppMessage("workspace.homeCardDescription")}</div>
      <AuthConfirmationPopover
        title={getAppMessage("workspace.signupRequiredForWorkspace")}
        callback={handleCreateWorkspace}
        source="homepage"
      >
        <RQButton
          type="primary"
          className="mt-16"
          onClick={() => {
            user.loggedIn && handleCreateWorkspace();
          }}
        >
          {getAppMessage("workspace.createNewWorkspace")}
        </RQButton>
      </AuthConfirmationPopover>
    </Col>
  );
};
