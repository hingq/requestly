import PATHS from "config/constants/sub/paths";
import { Navigate, RouteObject } from "react-router-dom";
import lazyload from "utils/lazyload";

const DesktopSessionsContainer = lazyload(() =>
  import("views/containers/DesktopSessionsContainer").then((m) => ({ default: m.DesktopSessionsContainer }))
);
const SavedSessionViewer = lazyload(() =>
  import("views/features/sessions/SessionViewer").then((m) => ({ default: m.SavedSessionViewer }))
);
const NetworkSessionsIndexPage = lazyload(
  () => import("views/features/sessions/SessionsIndexPageContainer/NetworkSessions")
);
const NetworkSessionViewer = lazyload(
  () => import("views/features/sessions/SessionsIndexPageContainer/NetworkSessions/NetworkSessionViewer")
);
const DraftSessionScreen = lazyload(() =>
  import("features/sessionBook").then((m) => ({ default: m.DraftSessionScreen }))
);
const SessionsListScreenContainer = lazyload(() =>
  import("features/sessionBook/screens/SessionsListScreen/SessionsListScreenContainer").then((m) => ({
    default: m.SessionsListScreenContainer,
  }))
);

export const desktopSessionsRoutes: RouteObject[] = [
  {
    path: PATHS.SESSIONS.DESKTOP.INDEX,
    element: <DesktopSessionsContainer />,
    children: [
      {
        path: "",
        element: <Navigate to={PATHS.SESSIONS.DESKTOP.SAVED_LOGS.RELATIVE} />,
      },
      {
        index: true,
        path: PATHS.SESSIONS.DESKTOP.SAVED_LOGS.RELATIVE,
        element: <NetworkSessionsIndexPage />,
      },
      {
        path: PATHS.SESSIONS.DESKTOP.WEB_SESSIONS.ABSOLUTE + "/imported",
        element: <DraftSessionScreen desktopMode={true} />,
      },
      {
        path: PATHS.SESSIONS.DESKTOP.WEB_SESSIONS_WRAPPER.RELATIVE,
        element: <SessionsListScreenContainer />,
      },
      {
        path: PATHS.SESSIONS.DESKTOP.SAVED_WEB_SESSION_VIEWER.ABSOLUTE + "/:id",
        element: <SavedSessionViewer />,
      },
      {
        path: PATHS.SESSIONS.DESKTOP.NETWORK.ABSOLUTE + "/:id",
        element: <NetworkSessionViewer />,
      },
      {
        path: PATHS.SESSIONS.DESKTOP.NETWORK.ABSOLUTE,
        element: <NetworkSessionViewer />,
      },
    ],
  },
];
