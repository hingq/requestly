import { RQButton } from "lib/design-system-v2/components";
import loggedOutUser from "/assets/media/common/loggedout-user.svg";
import "./loggedoutPopoverContent.scss";
import { trackLoginButtonClicked } from "modules/analytics/events/common/auth/login";
import { trackSignUpButtonClicked } from "modules/analytics/events/common/auth/signup";
import Link from "antd/lib/typography/Link";
import { SOURCE } from "modules/analytics/events/common/constants";
import { globalActions } from "store/slices/global/slice";
import { useDispatch } from "react-redux";
import APP_CONSTANTS from "config/constants";
import { getAppMessage } from "i18n";

export const LoggedOutPopoverContent = ({ onAuthButtonClick }: { onAuthButtonClick: () => void }) => {
  const dispatch = useDispatch();

  const handleAuthButtonClick = (authMode: string) => {
    dispatch(
      globalActions.toggleActiveModal({
        modalName: "authModal",
        newValue: true,
        newProps: {
          authMode,
          redirectURL: window.location.href,
          eventSource: SOURCE.NAVBAR,
        },
      })
    );
  };

  return (
    <div className="logged-out-popover-container">
      <div className="logged-out-popover-icon">
        <img src={loggedOutUser} height={32} width={32} alt="nudge-icon" className="nudge-prompt-icon" />
      </div>
      <div className="logged-out-popover-content">
        注册完全是可选的。注册后你可以访问管理员控制、实验性功能以及组织级设置。
      </div>
      <div className="logged-out-popover-button">
        <RQButton
          type="primary"
          onClick={() => {
            handleAuthButtonClick(APP_CONSTANTS.AUTH.ACTION_LABELS.SIGN_UP);
            trackSignUpButtonClicked(SOURCE.NAVBAR);
            onAuthButtonClick();
          }}
        >
          {getAppMessage("auth.signUp")}
        </RQButton>
      </div>
      <div className="logged-out-popover-subtitle">
        {getAppMessage("auth.alreadyHaveAccount")}{" "}
        <Link
          onClick={() => {
            handleAuthButtonClick(APP_CONSTANTS.AUTH.ACTION_LABELS.LOG_IN);
            trackLoginButtonClicked(SOURCE.NAVBAR);
            onAuthButtonClick();
          }}
        >
          {getAppMessage("auth.signIn")}
        </Link>
      </div>
    </div>
  );
};
