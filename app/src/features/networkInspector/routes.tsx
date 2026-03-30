import { RouteObject } from "react-router-dom";
import PATHS from "config/constants/sub/paths";
import lazyload from "utils/lazyload";

const NetworkInspectorContainer = lazyload(() => import("./container"));
const NetworkInspectorHomeScreen = lazyload(() =>
  import("./screens").then((m) => ({ default: m.NetworkInspectorHomeScreen }))
);

export const networkInspectorRoutes: RouteObject[] = [
  {
    path: PATHS.NETWORK_INSPECTOR.INDEX,
    element: <NetworkInspectorContainer />,
    children: [
      {
        index: true,
        element: <NetworkInspectorHomeScreen />,
      },
    ],
  },
];
