import { CONSTANTS as GLOBAL_CONSTANTS } from "@requestly/requestly-core";
import STORAGE from "config/constants/sub/storage";

export enum AuthTypes {
  FORGOT_PASSWORD = "forgot-password",
  RESET_PASSWORD = "reset-password",
  SIGN_IN = "sign-in",
  SIGN_UP = "sign-up",
}

const getForgotPasswordErrorMessage = (errorCode: string) => {
  switch (errorCode) {
    case "auth/user-not-found":
      return "找不到与该邮箱关联的账户，请重试。";

    case "auth/invalid-email":
      return "邮箱格式无效，请检查后重试。";

    default:
      return "暂时无法重置密码，请联系 " + GLOBAL_CONSTANTS.COMPANY_INFO.SUPPORT_EMAIL;
  }
};
const getSignInErrorMessage = (errorCode: string) => {
  switch (errorCode) {
    case "auth/invalid-email":
      return "请输入有效的邮箱地址";

    case "auth/user-not-found":
      return "该邮箱尚未注册，请先注册。";

    case "auth/wrong-password":
      return "邮箱或密码错误，请重试或使用找回密码。";

    case "auth/user-disabled":
      return "你的账户已被禁用，请联系 " + GLOBAL_CONSTANTS.COMPANY_INFO.SUPPORT_EMAIL;

    default:
      return "登录失败，请联系 " + GLOBAL_CONSTANTS.COMPANY_INFO.SUPPORT_EMAIL;
  }
};

const getSignUpErrorMessage = (errorCode: string) => {
  switch (errorCode) {
    case "no-name":
      return "请输入姓名。";
    case "no-email":
    case "auth/invalid-email":
      return "请输入有效的邮箱地址。";
    case "no-password":
      return "请输入用于创建账户的密码。";
    case "auth/email-already-in-use":
      return "该邮箱已被使用，请直接登录。";
    case "auth/weak-password":
      return "请设置更强的密码";
    case "auth/operation-not-allowed":
      return "你的账户已被禁用，请联系 " + GLOBAL_CONSTANTS.COMPANY_INFO.SUPPORT_EMAIL;
    default:
      console.error("Unknown error code", errorCode);
      return "注册失败，请联系 " + GLOBAL_CONSTANTS.COMPANY_INFO.SUPPORT_EMAIL;
  }
};

export const getAuthErrorMessage = (authType: string, errorCode: string) => {
  switch (authType) {
    case AuthTypes.SIGN_IN:
      return getSignInErrorMessage(errorCode);

    case AuthTypes.SIGN_UP:
      return getSignUpErrorMessage(errorCode);

    case AuthTypes.FORGOT_PASSWORD:
      return getForgotPasswordErrorMessage(errorCode);

    default:
      return "发生未知错误，请联系 " + GLOBAL_CONSTANTS.COMPANY_INFO.SUPPORT_EMAIL;
  }
};

export const getDesktopAppAuthParams = (): URLSearchParams | null => {
  try {
    const EXPIRY_DURATION = 3 * 60 * 1000; // 3mins -> milliseconds
    const value = window.localStorage.getItem(STORAGE.LOCAL_STORAGE.RQ_DESKTOP_APP_AUTH_PARAMS);
    if (!value) {
      return null;
    }

    const paramsObj = JSON.parse(value) as { params: string; createdAt: number };

    if (Date.now() - paramsObj.createdAt > EXPIRY_DURATION) {
      return null;
    }

    return new URLSearchParams(paramsObj.params);
  } catch (error) {
    return null;
  }
};
