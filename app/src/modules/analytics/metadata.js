import { getAppDetails } from "utils/AppUtils";

export const getLinkWithMetadata = (link) => {
  const { app_version } = getAppDetails();
  const url = new URL(link);
  url.searchParams.set("app_version", app_version);
  return url.toString();
};
