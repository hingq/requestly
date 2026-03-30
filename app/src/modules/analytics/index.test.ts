import { beforeEach, describe, expect, it, vi } from "vitest";

import { initIntegrations, trackAttr, trackEvent } from "./index.js";

const { posthogIntegrationMock, localIntegrationMock } = vi.hoisted(() => ({
  posthogIntegrationMock: {
    init: vi.fn(),
    trackEvent: vi.fn(),
    trackAttr: vi.fn(),
  },
  localIntegrationMock: {
    init: vi.fn(),
    trackAttr: vi.fn(),
  },
}));

vi.mock("utils/AppUtils", () => ({
  getAppDetails: () => ({ app_mode: "web", app_version: "1.0.0" }),
}));

vi.mock("lib/logger", () => ({
  default: {
    log: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("utils/EnvUtils", () => ({
  isEnvAutomation: () => false,
}));

vi.mock("./integrations/posthog", () => ({
  default: posthogIntegrationMock,
}));

vi.mock("./integrations/local", () => ({
  default: localIntegrationMock,
}));

vi.mock("./events/features/constants", () => ({
  SYNCING: {
    SYNC: {
      TRIGGERED: "sync_triggered",
      COMPLETED: "sync_completed",
      FAILED: "sync_failed",
    },
    BACKUP: {
      CREATED: "backup_created",
    },
  },
}));

vi.mock("features/workspaces/types", () => ({
  WorkspaceType: {
    LOCAL: "local",
    SHARED: "shared",
    PERSONAL: "personal",
  },
}));

describe("analytics", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    const topWindow = {};

    vi.stubGlobal("localStorage", {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    });

    vi.stubGlobal("window", {
      top: topWindow,
      self: topWindow,
      currentlyActiveWorkspaceType: "personal",
      currentlyActiveWorkspaceTeamRole: "owner",
      currentlyActiveWorkspaceTeamId: "team-1",
      workspaceMembersCount: 4,
    });
  });

  it("does not send analytics events to external integrations", () => {
    trackEvent("rule_created", { source: "header" });

    expect(posthogIntegrationMock.trackEvent).not.toHaveBeenCalled();
  });

  it("keeps local attribute syncing without sending external attribute updates", () => {
    trackAttr("device_id", "device-123");

    expect(localIntegrationMock.trackAttr).toHaveBeenCalledWith("device_id", "device-123");
    expect(posthogIntegrationMock.trackAttr).not.toHaveBeenCalled();
  });

  it("initializes only local integrations", () => {
    const dispatch = vi.fn();

    initIntegrations({ uid: "user-1" }, dispatch);

    expect(localIntegrationMock.init).toHaveBeenCalledWith(null, dispatch);
    expect(posthogIntegrationMock.init).not.toHaveBeenCalled();
  });
});
