import { RouteObject } from "react-router-dom";
import PATHS from "config/constants/sub/paths";
import lazyload from "utils/lazyload";

const InviteView = lazyload(() => import("views/misc/Invite"));

export const inviteRoutes: RouteObject[] = [
  {
    path: PATHS.INVITE.RELATIVE,
    element: <InviteView />,
  },
];
