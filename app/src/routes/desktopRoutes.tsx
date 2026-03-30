import { Navigate, RouteObject } from "react-router-dom";
import PATHS from "config/constants/sub/paths";
import lazyload from "utils/lazyload";

const ManualProxySetup = lazyload(() => import("components/mode-specific/desktop/ManualProxySetup"));
const MySources = lazyload(() => import("components/mode-specific/desktop/MySources"));
const InterceptTraffic = lazyload(() => import("components/mode-specific/desktop/InterceptTraffic"));

export const desktopRoutes: RouteObject[] = [
  {
    path: PATHS.DESKTOP.MANUAL_SETUP.RELATIVE,
    // @ts-ignore
    element: <ManualProxySetup />,
  },
  {
    path: PATHS.DESKTOP.MY_APPS.ABSOLUTE,
    element: <MySources />,
  },
  {
    path: PATHS.DESKTOP.INTERCEPT_TRAFFIC.ABSOLUTE,
    element: <InterceptTraffic />,
  },
  {
    path: PATHS.DESKTOP.RELATIVE,
    element: <Navigate to={PATHS.DESKTOP.MY_APPS.ABSOLUTE} />,
  },
];
