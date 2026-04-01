import { SYNCING } from "./events/features/constants";
import localIntegration from "./integrations/local";

// These are mostly not user-triggered
const BLACKLISTED_EVENTS = [
  SYNCING.SYNC.TRIGGERED,
  SYNCING.SYNC.COMPLETED,
  SYNCING.SYNC.FAILED,
  SYNCING.BACKUP.CREATED,
];

export const trackEvent = (name, params, config) => {
  if (BLACKLISTED_EVENTS.includes(name)) return;
};

export const trackAttr = (name, value) => {
  if (!name) return;

  name = name?.toLowerCase();
  localIntegration.trackAttr(name, value);
};

export const initIntegrations = (user, dispatch) => {
  if (window.top === window.self) {
    localIntegration.init(null, dispatch);
  }
};
