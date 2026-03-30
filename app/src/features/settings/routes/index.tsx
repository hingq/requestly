import { Navigate, RouteObject } from "react-router-dom";
import PATHS from "config/constants/sub/paths";
import ProtectedRoute from "components/authentication/ProtectedRoute";
import { isFeatureCompatible } from "utils/CompatibilityUtils";
import FEATURES from "config/constants/sub/features";
import { isDesktopMode } from "utils/AppUtils";
import lazyload from "utils/lazyload";

const SettingsIndexPage = lazyload(() => import("../components/SettingsIndex"));
const GlobalSettings = lazyload(() =>
  import("../components/GlobalSettings").then((m) => ({ default: m.GlobalSettings }))
);
const DesktopSettings = lazyload(() =>
  import("../components/DesktopSettings").then((m) => ({ default: m.DesktopSettings }))
);
const SessionsSettings = lazyload(() =>
  import("../components/SessionsBookSettings").then((m) => ({ default: m.SessionsSettings }))
);
const MyTeams = lazyload(() => import("../components/WorkspaceSettings/components/MyTeams"));
const ConfigurationPage = lazyload(() => import("views/features/sessions/ConfigurationPage"));
const BillingTeamContainer = lazyload(() =>
  import("../components/BillingTeam").then((m) => ({ default: m.BillingTeamContainer }))
);
const OrgMembersView = lazyload(() =>
  import("../components/OrgMembers/OrgMembers").then((m) => ({ default: m.OrgMembersView }))
);
const Profile = lazyload(() => import("../components/Profile/ManageAccount"));
const BillingTeamDetails = lazyload(() =>
  import("../components/BillingTeam/components/BillingDetails").then((m) => ({ default: m.BillingTeamDetails }))
);
const BillingList = lazyload(() =>
  import("../components/BillingTeam/components/BillingList").then((m) => ({ default: m.BillingList }))
);
const UserPlanDetails = lazyload(() =>
  import("../components/BillingTeam/components/UserPlanDetails").then((m) => ({ default: m.UserPlanDetails }))
);
const Secrets = lazyload(() => import("features/settings/secrets-manager"));
const SecretsLayout = lazyload(() => import("../secrets-manager/SecretsLayout"));
const ManageProviders = lazyload(() => import("../secrets-manager/ManageProviders/Index"));
const SecretsModalsProvider = lazyload(() =>
  import("../secrets-manager/context/SecretsModalsContext").then((m) => ({ default: m.SecretsModalsProvider }))
);

const isSessionsNewSettingsPageCompatible = isFeatureCompatible(FEATURES.SESSION_ONBOARDING);
const isSecretsManagerCompatible = isFeatureCompatible(FEATURES.SECRETS_MANAGER);

export const settingRoutes: RouteObject[] = [
  {
    path: PATHS.SETTINGS.RELATIVE,
    element: <SettingsIndexPage />,
    children: [
      {
        path: PATHS.SETTINGS.GLOBAL_SETTINGS.RELATIVE,
        element: <GlobalSettings />,
      },
      {
        path: PATHS.SETTINGS.DESKTOP_SETTINGS.RELATIVE,
        element: <DesktopSettings />,
      },

      ...(isSecretsManagerCompatible
        ? [
            {
              path: PATHS.SETTINGS.SECRETS.RELATIVE,
              element: (
                <SecretsModalsProvider>
                  <SecretsLayout />
                </SecretsModalsProvider>
              ),
              children: [
                {
                  index: true,
                  element: <Secrets />,
                },
                ...(isDesktopMode()
                  ? [
                      {
                        path: PATHS.SETTINGS.SECRETS.MANAGE_PROVIDERS.RELATIVE,
                        element: <ManageProviders />,
                      },
                    ]
                  : []),
              ],
            },
          ]
        : []),

      {
        path: PATHS.SETTINGS.SESSION_BOOK.RELATIVE,
        element: (
          <ProtectedRoute component={isSessionsNewSettingsPageCompatible ? SessionsSettings : ConfigurationPage} />
        ),
      },
      {
        path: PATHS.SETTINGS.WORKSPACES.RELATIVE,
        element: <ProtectedRoute component={MyTeams} />,
      },
      {
        path: PATHS.SETTINGS.MEMBERS.RELATIVE,
        element: <ProtectedRoute component={OrgMembersView} />,
      },
      {
        path: PATHS.SETTINGS.BILLING.RELATIVE,
        element: <ProtectedRoute component={BillingTeamContainer} />,
        children: [
          {
            index: true,
            element: <BillingList />,
          },
          {
            path: PATHS.SETTINGS.BILLING.RELATIVE + "/:billingId",
            element: <BillingTeamDetails />,
          },
        ],
      },
      {
        path: PATHS.SETTINGS.PROFILE.RELATIVE,
        element: <ProtectedRoute component={Profile} />,
      },
      {
        path: PATHS.SETTINGS.MY_PLAN.RELATIVE,
        element: <ProtectedRoute component={UserPlanDetails} />,
      },
    ],
  },
  {
    path: PATHS.SETTINGS.STORAGE_SETTINGS.RELATIVE,
    element: <Navigate to={PATHS.SETTINGS.STORAGE_SETTINGS.RELATIVE} />,
  },
  {
    path: PATHS.LEGACY.SETTINGS.ABSOLUTE,
    element: <Navigate to={PATHS.SETTINGS.RELATIVE} />,
  },
];
