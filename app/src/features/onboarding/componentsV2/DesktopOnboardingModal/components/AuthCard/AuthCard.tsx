import React from "react";
import { IoMdArrowBack } from "@react-icons/all-files/io/IoMdArrowBack";
import { RQButton } from "lib/design-system-v2/components";
import LINKS from "config/constants/sub/links";
import { useDispatch, useSelector } from "react-redux";
import { globalActions } from "store/slices/global/slice";
import { getAppMode } from "store/selectors";
import { CONSTANTS as GLOBAL_CONSTANTS } from "@requestly/requestly-core";
import { SOURCE } from "modules/analytics/events/common/constants";
import APP_CONSTANTS from "config/constants";
import { getAppMessage } from "i18n";
import "./authCard.scss";

interface Props {
  onBackClick: () => void;
}

export const AuthCard: React.FC<Props> = ({ onBackClick }) => {
  const dispatch = useDispatch();
  const appMode = useSelector(getAppMode);

  const handleAuthButtonClick = (authMode: string) => {
    dispatch(
      globalActions.toggleActiveModal({
        modalName: "authModal",
        newValue: true,
        newProps: {
          authMode,
          eventSource:
            appMode === GLOBAL_CONSTANTS.APP_MODES.DESKTOP ? SOURCE.DESKTOP_ONBOARDING : SOURCE.EXTENSION_ONBOARDING,
        },
      })
    );
  };
  return (
    <>
      <div className="auth-card-header">
        <IoMdArrowBack onClick={onBackClick} />
        {getAppMessage("auth.createFreeAccount")}
      </div>

      <div className="auth-card-description">{getAppMessage("auth.desktopSignupRedirectDescription")}</div>
      <div className="auth-card-actions">
        <RQButton
          type="primary"
          block
          size="large"
          onClick={() => handleAuthButtonClick(APP_CONSTANTS.AUTH.ACTION_LABELS.SIGN_UP)}
        >
          {getAppMessage("auth.createNewAccount")}
        </RQButton>
        <RQButton block size="large" onClick={() => handleAuthButtonClick(APP_CONSTANTS.AUTH.ACTION_LABELS.LOG_IN)}>
          {`${getAppMessage("auth.alreadyHaveAccount")} ${getAppMessage("auth.signIn")}`}
        </RQButton>
      </div>

      <div className="auth-card-footer">
        {getAppMessage("auth.signInAgreementPrefix")}{" "}
        <a href={LINKS.REQUESTLY_TERMS_AND_CONDITIONS} target="_blank" rel="noreferrer">
          {getAppMessage("auth.terms")}
        </a>{" "}
        和{" "}
        <a href={LINKS.REQUESTLY_PRIVACY_POLICY} target="_blank" rel="noreferrer">
          {getAppMessage("auth.privacyStatement")}
        </a>
      </div>
    </>
  );
};
