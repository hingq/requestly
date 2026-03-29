import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { RQButton, RQInput } from "lib/design-system/components";
import { toast } from "utils/Toast";
import { Typography, Row, Col } from "antd";
import { FaSpinner } from "@react-icons/all-files/fa/FaSpinner";

//IMAGES
// import AppleIconWhite from "../../../assets/img/icons/common/apple-white.svg";
// import MicrosoftIcon from "../../../assets/img/icons/common/microsoft.svg";
// import GithubIcon from "../../../assets/img/icons/common/github.svg";

import { getAuthErrorMessage, AuthTypes } from "../utils";

//CONSTANTS
import { CONSTANTS as GLOBAL_CONSTANTS } from "@requestly/requestly-core";
import APP_CONSTANTS from "../../../config/constants";
import PATHS from "config/constants/sub/paths";

//ACTIONS
import {
  handleEmailSignIn,
  handleEmailSignUp,
  handleForgotPasswordButtonOnClick,
  handleGoogleSignIn,
  handleResetPasswordOnClick,
} from "features/onboarding/components/auth/components/Form/actions";

//UTILS
import { getQueryParamsAsMap } from "../../../utils/URLUtils";
import { getAppMode, getTimeToResendEmailLogin } from "../../../store/selectors";
import { trackAuthModalShownEvent } from "modules/analytics/events/common/auth/authModal";

//STYLES
import { AuthFormHero } from "./AuthFormHero";
import "./AuthForm.css";
import GenerateLoginLinkBtn from "./GenerateLoginLinkButton";
import { useDispatch } from "react-redux";
import { globalActions } from "store/slices/global/slice";
import { getLinkWithMetadata } from "modules/analytics/metadata";
import { getAppMessage } from "i18n";

const { ACTION_LABELS: AUTH_ACTION_LABELS, METHODS: AUTH_METHODS } = APP_CONSTANTS.AUTH;

const AuthForm = ({
  setAuthMode: SET_MODE,
  authMode: MODE,
  authMethod: AUTH_METHOD = null,
  setPopoverVisible: SET_POPOVER = () => {},
  eventSource,
  callbacks,
  isOnboardingForm,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  //LOAD PROPS
  const callbackFromProps = callbacks || {};
  const { onSignInSuccess, onRequestPasswordResetSuccess } = callbackFromProps;

  //GLOBAL STATE
  const appMode = useSelector(getAppMode);
  const timeToResendEmailLogin = useSelector(getTimeToResendEmailLogin);
  const [actionPending, setActionPending] = useState(false);
  const [lastEmailInputHandled, setLastEmailInputHandled] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState();
  // const [emailOptin, setEmailOptin] = useState(false);
  const [trackEvent, setTrackEvent] = useState(true);
  const currentTestimonialIndex = useMemo(() => Math.floor(Math.random() * 3), []);

  const showPasswordSignInOptionInstead =
    appMode === GLOBAL_CONSTANTS.APP_MODES.DESKTOP ||
    (AUTH_METHOD && AUTH_METHOD.toUpperCase() === AUTH_METHODS.PASSWORD.toUpperCase());

  useEffect(() => {
    // Updating reference code from query parameters
    let queryParams = getQueryParamsAsMap();
    if (!referralCode && typeof referralCode != "string") {
      if (queryParams["rcode"]) {
        setReferralCode(queryParams["rcode"]);
      } else {
        setReferralCode("");
      }
    }
    if (trackEvent) {
      trackAuthModalShownEvent(eventSource);
      setTrackEvent(false);
    }
  }, [eventSource, referralCode, trackEvent]);

  useEffect(() => {
    if (timeToResendEmailLogin !== 0) {
      if (lastEmailInputHandled !== email) {
        dispatch(globalActions.updateTimeToResendEmailLogin(0));
      }
    }
  }, [dispatch, email, lastEmailInputHandled, timeToResendEmailLogin]);

  const handleGoogleSignInButtonClick = () => {
    setActionPending(true);
    handleGoogleSignIn(appMode, MODE, eventSource)
      .then((result) => {
        if (result && result.uid) {
          const greatingName = result.displayName?.split(" ")?.[0];
          !isOnboardingForm &&
            toast.info(
              greatingName ? `${getAppMessage("auth.welcomeBack")}，${greatingName}` : getAppMessage("auth.welcome")
            );
          // syncUserPersona(result.uid, dispatch, userPersona); TEMP DISABLED
          onSignInSuccess && onSignInSuccess(result.uid, result.isNewUser);
        }
        setActionPending(false);
      })
      .catch((e) => {
        setActionPending(false);
      });
  };

  const handleEmailSignUpButtonClick = (event) => {
    event.preventDefault();
    setActionPending(true);
    handleEmailSignUp(email, password, referralCode, eventSource)
      .then(({ status, errorCode }) => {
        if (status) {
          handleEmailSignIn(email, password, true, eventSource)
            .then(({ result }) => {
              if (result.user.uid) {
                const greatingName = result.user.displayName?.split(" ")?.[0];
                !isOnboardingForm &&
                  toast.info(
                    greatingName
                      ? `${getAppMessage("auth.welcomeBack")}，${greatingName}`
                      : getAppMessage("auth.welcome")
                  );
                setEmail("");
                setPassword("");
                // syncUserPersona(result.user.uid, dispatch, userPersona); TEMP DISABLED
                onSignInSuccess && onSignInSuccess(result.user.uid, true);
              }
            })
            .catch((err) => {
              toast.error(getAuthErrorMessage(AuthTypes.SIGN_UP, err.errorCode));
              setActionPending(false);
              setEmail("");
              setPassword("");
            });
        } else {
          toast.error(getAuthErrorMessage(AuthTypes.SIGN_UP, errorCode));
          setActionPending(false);
        }
      })
      .catch((err) => {
        toast.error(getAuthErrorMessage(AuthTypes.SIGN_UP, err.errorCode));
        setActionPending(false);
      });
  };

  const handleEmailSignInButtonClick = (event) => {
    event.preventDefault();
    setActionPending(true);
    handleEmailSignIn(email, password, false, eventSource)
      .then(({ result }) => {
        if (result.user.uid) {
          const greatingName = result.user.displayName?.split(" ")?.[0];
          !isOnboardingForm &&
            toast.info(
              greatingName ? `${getAppMessage("auth.welcomeBack")}，${greatingName}` : getAppMessage("auth.welcome")
            );
          setEmail("");
          setPassword("");
          // syncUserPersona(result.user.uid, dispatch, userPersona); TEMP DISABLED
          onSignInSuccess && onSignInSuccess(result.user.uid, false);
        } else {
          toast.error(getAppMessage("auth.invalidLoginRetry"));
          setActionPending(true);
        }
      })
      .catch((err) => {
        toast.error(getAuthErrorMessage(AuthTypes.SIGN_IN, err.errorCode));
        setActionPending(false);
        setEmail("");
        setPassword("");
      });
  };

  const SocialAuthButtons = () => {
    switch (MODE) {
      case AUTH_ACTION_LABELS.LOG_IN:
      case AUTH_ACTION_LABELS.SIGN_UP:
        return (
          <>
            {/* <Button
                    className="btn-neutral btn-icon"
                    color="default"
                    onClick={(e) => e.preventDefault()}
                  >
                    <span className="btn-inner--icon">
                      <img alt="Login with Github" src={GithubIcon} />
                    </span>
                    <span className="btn-inner--text">Github</span>
                  </Button> */}
            <RQButton className="btn-default text-bold w-full" onClick={handleGoogleSignInButtonClick}>
              <img src={"/assets/media/common/google.svg"} alt="google" className="auth-icons" />
              {MODE === AUTH_ACTION_LABELS.SIGN_UP
                ? getAppMessage("auth.signUpWithGoogle")
                : getAppMessage("auth.signInWithGoogle")}
            </RQButton>
          </>
        );

      default:
        return null;
    }
  };
  const InfoMessage = () => {
    switch (MODE) {
      case AUTH_ACTION_LABELS.REQUEST_RESET_PASSWORD:
        return (
          <Typography.Text className="secondary-text">
            {getAppMessage("auth.passwordResetInstructions")} <strong>no-reply@requestly.io</strong>
            {getAppMessage("auth.passwordResetInstructionsSuffix")}
          </Typography.Text>
        );
      case AUTH_ACTION_LABELS.DO_RESET_PASSWORD:
        return <Typography.Text className="secondary-text">{getAppMessage("auth.newPasswordPrompt")}</Typography.Text>;

      default:
        return null;
    }
  };

  const FormSubmitButton = () => {
    if (actionPending) {
      return (
        <RQButton className="w-full primary form-elements-margin" type="primary">
          <FaSpinner className="icon-spin" />
        </RQButton>
      );
    }
    switch (MODE) {
      default:
      case AUTH_ACTION_LABELS.LOG_IN:
        if (showPasswordSignInOptionInstead) {
          return (
            <RQButton type="primary" className="form-elements-margin w-full" onClick={handleEmailSignInButtonClick}>
              {getAppMessage("auth.signInWithEmail")}
            </RQButton>
          );
        }
        return (
          <GenerateLoginLinkBtn
            email={email}
            authMode={AUTH_ACTION_LABELS.LOG_IN}
            eventSource={eventSource}
            callback={() => {
              setLastEmailInputHandled(email);
            }}
          />
        );

      case AUTH_ACTION_LABELS.SIGN_UP:
        if (showPasswordSignInOptionInstead) {
          return (
            <RQButton type="primary" className="form-elements-margin w-full" onClick={handleEmailSignUpButtonClick}>
              {getAppMessage("auth.createAccount")}
            </RQButton>
          );
        }
        return (
          <GenerateLoginLinkBtn
            email={email}
            authMode={AUTH_ACTION_LABELS.SIGN_UP}
            eventSource={eventSource}
            callback={() => {
              setLastEmailInputHandled(email);
            }}
          />
        );
      case AUTH_ACTION_LABELS.REQUEST_RESET_PASSWORD:
        return (
          <RQButton
            type="primary"
            className="form-elements-margin w-full mt-16"
            onClick={(event) =>
              handleForgotPasswordButtonOnClick(event, email, setActionPending, onRequestPasswordResetSuccess)
            }
          >
            {getAppMessage("auth.sendResetLink")}
          </RQButton>
        );
      case AUTH_ACTION_LABELS.DO_RESET_PASSWORD:
        return (
          <RQButton
            type="primary"
            className="form-elements-margin w-full"
            onClick={(event) =>
              handleResetPasswordOnClick(event, password, setActionPending, navigate, () =>
                SET_MODE(AUTH_ACTION_LABELS.LOG_IN)
              )
            }
          >
            {getAppMessage("auth.createNewPassword")}
          </RQButton>
        );
    }
  };

  const renderRightFooterLink = () => {
    switch (MODE) {
      case AUTH_ACTION_LABELS.LOG_IN:
        return (
          <Col className="mt-1">
            <span
              className="text-right text-muted cursor-pointer text-underline caption"
              onClick={() => {
                SET_MODE(AUTH_ACTION_LABELS.REQUEST_RESET_PASSWORD);
                SET_POPOVER(false);
                setEmail("");
                setPassword("");
              }}
            >
              {getAppMessage("auth.forgotPassword")}
            </span>
          </Col>
        );

      case AUTH_ACTION_LABELS.DO_RESET_PASSWORD:
        return (
          <Col className="mt-1">
            <span
              className="float-right text-muted cursor-pointer text-underline caption"
              onClick={() => {
                SET_MODE(AUTH_ACTION_LABELS.REQUEST_RESET_PASSWORD);
                SET_POPOVER(false);
              }}
            >
              {getAppMessage("auth.resendEmail")}
            </span>
          </Col>
        );

      case AUTH_ACTION_LABELS.REQUEST_RESET_PASSWORD:
        return (
          <Col>
            <span
              className="float-right text-muted cursor-pointer"
              onClick={() => {
                SET_MODE(AUTH_ACTION_LABELS.SIGN_UP);
                SET_POPOVER(true);
              }}
            >
              {getAppMessage("auth.signUp")}
            </span>
          </Col>
        );
      default:
        return null;
    }
  };

  const renderPasswordField = () => {
    switch (MODE) {
      case AUTH_ACTION_LABELS.LOG_IN:
      case AUTH_ACTION_LABELS.SIGN_UP:
      case AUTH_ACTION_LABELS.DO_RESET_PASSWORD:
        return (
          <Row className={`${MODE !== AUTH_ACTION_LABELS.DO_RESET_PASSWORD && "form-elements-margin"} w-full`}>
            {/* <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="ni ni-lock-circle-open" />
                </InputGroupText>
              </InputGroupAddon> */}
            <label htmlFor="password" className="text-bold auth-modal-input-label">
              {getAppMessage("auth.password")}
            </label>
            <RQInput
              id="password"
              className="auth-modal-input"
              required={true}
              placeholder={
                MODE === AUTH_ACTION_LABELS.SIGN_UP
                  ? getAppMessage("auth.minimum8Characters")
                  : getAppMessage("auth.enterPassword")
              }
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            {renderRightFooterLink()}
          </Row>
        );

      default:
        return null;
    }
  };

  const renderEmailField = () => {
    switch (MODE) {
      case AUTH_ACTION_LABELS.DO_RESET_PASSWORD:
        return null;
      default:
        return (
          <Row className={`${MODE !== AUTH_ACTION_LABELS.REQUEST_RESET_PASSWORD && "form-elements-margin"} w-full`}>
            <label htmlFor="email" className="text-bold auth-modal-input-label">
              {MODE === AUTH_ACTION_LABELS.SIGN_UP ? getAppMessage("auth.enterWorkEmail") : getAppMessage("auth.email")}
            </label>
            <RQInput
              id="email"
              className="auth-modal-input "
              required={true}
              placeholder={
                MODE === AUTH_ACTION_LABELS.REQUEST_RESET_PASSWORD || MODE === AUTH_ACTION_LABELS.LOG_IN
                  ? getAppMessage("auth.enterEmail")
                  : getAppMessage("auth.workEmailPlaceholder")
              }
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </Row>
        );
    }
  };

  const onSignInClick = useCallback(() => {
    SET_MODE(AUTH_ACTION_LABELS.LOG_IN);
    SET_POPOVER(true);
    setEmail("");
    setPassword("");
    dispatch(globalActions.updateTimeToResendEmailLogin(0));
  }, [SET_MODE, SET_POPOVER, dispatch]);

  const onCreateAccountClick = useCallback(() => {
    SET_MODE(AUTH_ACTION_LABELS.SIGN_UP);
    SET_POPOVER(true);
    setEmail("");
    setPassword("");
    dispatch(globalActions.updateTimeToResendEmailLogin(0));
  }, [SET_MODE, SET_POPOVER, dispatch]);

  return (
    <Row className="bg-secondary shadow border-0 auth-modal">
      {MODE === AUTH_ACTION_LABELS.SIGN_UP ? (
        <Col span={24}>
          <div className={!isOnboardingForm ? "display-flex" : "onboarding-auth-from-wrapper"}>
            {!isOnboardingForm && <AuthFormHero currentTestimonialIndex={currentTestimonialIndex} />}

            <Col span={11} className="signup-modal-section-wrapper signup-form-wrapper">
              <Typography.Text type="primary" className="text-bold w-full header">
                {location.pathname === PATHS.APPSUMO.RELATIVE
                  ? getAppMessage("auth.signUpToRedeemAppsumo")
                  : getAppMessage("auth.requestlyAccount")}
              </Typography.Text>

              <Row align={"middle"} className="mt-1">
                <Typography.Text className="secondary-text">
                  {getAppMessage("auth.alreadyUsingRequestly")}
                </Typography.Text>
                <RQButton className="btn-default text-bold caption modal-signin-btn" onClick={onSignInClick}>
                  {getAppMessage("auth.signIn")}
                </RQButton>
              </Row>
              <Row className="auth-wrapper mt-1">
                <SocialAuthButtons />
                <div className="auth-modal-divider w-full">{getAppMessage("auth.or")}</div>
                <div className="auth-modal-message w-full">{getAppMessage("auth.signUpWithEmail")}</div>

                {renderEmailField()}
                {showPasswordSignInOptionInstead && renderPasswordField()}
                <FormSubmitButton />
                <Typography.Text className="secondary-text form-elements-margin">
                  {getAppMessage("auth.appsumoTermsPrefix")}{" "}
                  <a
                    className="auth-modal-link"
                    href={getLinkWithMetadata("https://requestly.com/terms")}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {getAppMessage("auth.requestlyTerms")}
                  </a>
                  {getAppMessage("auth.appsumoTermsMiddle")}{" "}
                  <a
                    className="auth-modal-link"
                    href={getLinkWithMetadata("https://requestly.com/privacy")}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {getAppMessage("auth.privacyPolicy")}
                  </a>
                  .
                </Typography.Text>
              </Row>
            </Col>
          </div>
        </Col>
      ) : MODE === AUTH_ACTION_LABELS.LOG_IN ? (
        <Col span={24} className="login-modal-wrapper">
          <Typography.Text type="primary" className="text-bold w-full header">
            {getAppMessage("auth.signIn")}
          </Typography.Text>
          <Row align={"middle"} className="mt-1">
            <Typography.Text className="secondary-text">{getAppMessage("auth.or")}</Typography.Text>
            <RQButton className="btn-default text-bold caption modal-signin-btn" onClick={onCreateAccountClick}>
              {getAppMessage("auth.createNewAccount")}
            </RQButton>
          </Row>
          <Row className="auth-wrapper mt-1">
            <SocialAuthButtons />
            <div className="auth-modal-divider w-full">{getAppMessage("auth.or")}</div>
            <div className="auth-modal-message w-full">{getAppMessage("auth.signInWithEmail")}</div>
            {renderEmailField()}
            {showPasswordSignInOptionInstead && renderPasswordField()}
            <FormSubmitButton />
          </Row>
        </Col>
      ) : (
        <Col span={24} className="login-modal-wrapper">
          <Typography.Text type="primary" className="text-bold w-full header">
            {MODE === AUTH_ACTION_LABELS.REQUEST_RESET_PASSWORD
              ? getAppMessage("auth.forgotYourPassword")
              : getAppMessage("auth.createNewPassword")}
          </Typography.Text>
          <Row className="mt-1">
            <InfoMessage />
          </Row>
          <Row className="auth-wrapper mt-1">
            <div className="w-full mt-20">{renderEmailField()}</div>
            {renderPasswordField()} {/* NOT SHOWN WHEN REQUESTING RESET */}
            <FormSubmitButton />
          </Row>
        </Col>
      )}
    </Row>
  );
};

export default AuthForm;
