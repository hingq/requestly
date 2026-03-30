import { Navigate, RouteObject } from "react-router-dom";
import PATHS from "config/constants/sub/paths";
import lazyload from "utils/lazyload";

const NetworkSessionViewer = lazyload(
  () => import("views/features/sessions/SessionsIndexPageContainer/NetworkSessions/NetworkSessionViewer")
);
const SessionsListScreenContainer = lazyload(() =>
  import("./screens/SessionsListScreen/SessionsListScreenContainer").then((m) => ({
    default: m.SessionsListScreenContainer,
  }))
);
const SessionsFeatureContainer = lazyload(() => import("./container"));
const DraftSessionScreen = lazyload(() =>
  import("features/sessionBook").then((m) => ({ default: m.DraftSessionScreen }))
);
const SavedSessionScreen = lazyload(() =>
  import("features/sessionBook").then((m) => ({ default: m.SavedSessionScreen }))
);

export const sessionRoutes: RouteObject[] = [
  {
    path: PATHS.SESSIONS.INDEX,
    element: <SessionsFeatureContainer />,
    children: [
      {
        index: true,
        element: <SessionsListScreenContainer />,
      },
      {
        path: PATHS.SESSIONS.DRAFT.INDEX + "/:tabId",
        element: <DraftSessionScreen />,
      },
      {
        path: PATHS.SESSIONS.SAVED.INDEX + "/:id",
        element: <SavedSessionScreen />,
      },
    ],
  },

  {
    // path: PATHS.SESSIONS.NETWORK.RELATIVE + "/:id",
    path: PATHS.NETWORK_LOGS.VIEWER.RELATIVE + "/:id",
    element: <NetworkSessionViewer />,
  },
  {
    // path: PATHS.SESSIONS.NETWORK.RELATIVE + "/:id", // todo
    path: PATHS.NETWORK_LOGS.HAR.INDEX,
    element: <NetworkSessionViewer />,
  },
  {
    /**
     * Avoids circular redirects
     */
    path: "r/" + PATHS.SESSIONS.SAVED.RELATIVE + "/:id",
    element: <Navigate to={window.location.pathname.replace("/r", "")} />,
  },
];
