import { RouteObject } from "react-router-dom";
import PATHS from "config/constants/sub/paths";
import ProtectedRoute from "components/authentication/ProtectedRoute";
import lazyload from "utils/lazyload";

const ApiClientEmptyView = lazyload(() =>
  import("./screens/apiClient/components/views/components/ApiClientEmptyView/ApiClientEmptyView").then((m) => ({
    default: m.ApiClientEmptyView,
  }))
);
const PostmanImporterView = lazyload(() =>
  import("./screens/PostmanImporterView/PostmanImporterView").then((m) => ({ default: m.PostmanImporterView }))
);
const ApiClientRouteElement = lazyload(() =>
  import("./components/RouteElement").then((m) => ({ default: m.ApiClientRouteElement }))
);

export const apiClientRoutes: RouteObject[] = [
  {
    path: PATHS.API_CLIENT.RELATIVE + "/*",
    element: <ApiClientRouteElement />,
    handle: {
      breadcrumb: {
        label: "API Client",
      },
    },
    children: [
      {
        index: true,
        element: <ApiClientEmptyView />,
      },
    ],
  },
  {
    path: PATHS.API_CLIENT.IMPORT_FROM_POSTMAN.ABSOLUTE,
    element: <ProtectedRoute component={PostmanImporterView} />,
  },
];
