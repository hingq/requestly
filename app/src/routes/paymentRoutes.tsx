import PATHS from "config/constants/sub/paths";
import { RouteObject } from "react-router-dom";
import lazyload from "utils/lazyload";

const UpgradeSuccess = lazyload(() => import("features/pricing").then((m) => ({ default: m.UpgradeSuccess })));
const UpgradeToAnnual = lazyload(() => import("features/pricing").then((m) => ({ default: m.UpgradeToAnnual })));

export const paymentRoutes: RouteObject[] = [
  {
    path: PATHS.UPGRADE_SUCCESS.ABSOLUTE,
    element: <UpgradeSuccess />,
  },
  {
    path: PATHS.UPGRADE_TO_ANNUAL.ABSOLUTE,
    element: <UpgradeToAnnual />,
  },
];
