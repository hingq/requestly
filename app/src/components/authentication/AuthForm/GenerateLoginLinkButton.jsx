import { RQButton } from "lib/design-system/components";
import { useCallback } from "react";
import "./AuthForm.css";
import { isEmailValid } from "utils/FormattingHelper";
import { toast } from "utils/Toast";
import { sendEmailLinkForSignin } from "actions/FirebaseActions";
import { useSelector } from "react-redux";
import { getTimeToResendEmailLogin } from "store/selectors";
import { useDispatch } from "react-redux";
import { globalActions } from "store/slices/global/slice";
import { updateTimeToResendEmailLogin } from "./MagicAuthLinkModal/actions";
import { getAppMessage } from "i18n";

export default function GenerateEmailAuthLinkBtn({ email, authMode, eventSource, callback }) {
  const timeToResendEmailLogin = useSelector(getTimeToResendEmailLogin);
  const dispatch = useDispatch();
  const resendInMessage = getAppMessage("magicLink.resendIn", (seconds) => `${seconds} 秒后可重新发送链接`);

  const startResetTimerAndAnimation = useCallback(() => {
    updateTimeToResendEmailLogin(dispatch, 30);
  }, [dispatch]);

  const handleBtnClick = useCallback(() => {
    if (!email || !isEmailValid(email)) {
      toast.warn(getAppMessage("magicLink.invalidEmail"));
    } else {
      startResetTimerAndAnimation();
      sendEmailLinkForSignin(email, eventSource).then(() => {
        // open dialog
        dispatch(
          globalActions.toggleActiveModal({
            modalName: "emailLoginLinkPopup",
            newValue: true,
            newProps: {
              email,
              authMode,
              eventSource,
            },
          })
        );
        callback && callback();
      });
    }
  }, [dispatch, email, authMode, eventSource, startResetTimerAndAnimation, callback]);

  return timeToResendEmailLogin > 0 ? (
    <RQButton
      title={getAppMessage("magicLink.checkInbox")}
      className="form-elements-margin w-full generate-login-link-btn-animation"
      disabled
    >
      {resendInMessage(timeToResendEmailLogin)}
    </RQButton>
  ) : (
    <RQButton type="primary" className="form-elements-margin w-full" onClick={handleBtnClick}>
      {getAppMessage("auth.continueWithEmail")}
    </RQButton>
  );
}
