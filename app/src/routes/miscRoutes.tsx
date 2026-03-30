import { Navigate, RouteObject } from "react-router-dom";
import PATHS from "config/constants/sub/paths";
import ProtectedRoute from "components/authentication/ProtectedRoute";
import lazyload from "utils/lazyload";

const Updates = lazyload(() => import("views/features/Updates"));
const Goodbye = lazyload(() => import("components/misc/Goodbye"));
const ExtensionInstalled = lazyload(() => import("components/misc/ExtensionInstalled"));
const InstallExtensionCTA = lazyload(() => import("components/misc/InstallExtensionCTA"));
const Page403 = lazyload(() => import("views/misc/ServerResponses/403"));
const Page404 = lazyload(() => import("views/misc/ServerResponses/404"));
const AcceptTeamInvite = lazyload(() => import("components/user/Teams/AcceptTeamInvite"));
const AppSumoModal = lazyload(() => import("components/landing/Appsumo/Appsumo"));
const Home = lazyload(() => import("components/Home").then((m) => ({ default: m.Home })));
const PricingIndexPage = lazyload(() =>
  import("features/pricing/components/PricingPage").then((m) => ({ default: m.PricingIndexPage }))
);
const ImportFromCharlesWrapperView = lazyload(() =>
  import("features/rules/screens/rulesList/components/RulesList/components").then((m) => ({
    default: m.ImportFromCharlesWrapperView,
  }))
);
const ImportFromModheaderWrapperView = lazyload(() =>
  import(
    "features/rules/screens/rulesList/components/RulesList/components/ImporterComponents/ModheaderImporter/ImportFromModheaderScreen"
  ).then((m) => ({ default: m.ImportFromModheaderWrapperView }))
);
const ImportFromResourceOverrideWrapperView = lazyload(() =>
  import(
    "features/rules/screens/rulesList/components/RulesList/components/ImporterComponents/ResourceOverrideImporter"
  ).then((m) => ({ default: m.ImportFromResourceOverrideWrapperView }))
);
const HeaderEditorImportScreen = lazyload(() =>
  import(
    "features/rules/screens/rulesList/components/RulesList/components/ImporterComponents/HeaderEditorImporter/HeaderEditorImporterScreen"
  ).then((m) => ({ default: m.HeaderEditorImportScreen }))
);
const SeleniumImporter = lazyload(() => import("views/misc/SeleniumImporter"));
const GithubStudentPack = lazyload(() =>
  import("features/onboarding/componentsV2/GithubStudentPack/GithubStudentPack").then((m) => ({
    default: m.GithubStudentPack,
  }))
);
const QuitDesktop = lazyload(() => import("components/misc/QuitDesktop"));

export const miscRoutes: RouteObject[] = [
  {
    path: PATHS.DESKTOP.QUIT.RELATIVE,
    element: <QuitDesktop />,
  },
  {
    path: PATHS.EXTENSION_INSTALLED.RELATIVE,
    element: <ExtensionInstalled />,
  },
  {
    path: PATHS.EXTENSION_UPDATED.RELATIVE,
    element: <Navigate to={PATHS.RULES.MY_RULES.ABSOLUTE} />,
  },
  {
    path: PATHS.INSTALL_EXTENSION.RELATIVE,
    // @ts-ignore: takes few props
    element: <InstallExtensionCTA />,
  },
  {
    path: PATHS.UPDATES.RELATIVE,
    element: <Updates />,
  },
  {
    path: PATHS.PRICING.RELATIVE,
    element: <PricingIndexPage />,
  },
  {
    path: PATHS.GOODBYE.RELATIVE,
    element: <Goodbye />,
  },
  {
    path: PATHS.LEGACY.GOODBYE.ABSOLUTE,
    element: <Navigate to={PATHS.GOODBYE.RELATIVE} />,
  },
  {
    path: PATHS.PAGE403.RELATIVE,
    element: <Page403 />,
  },
  {
    path: PATHS.PAGE404.RELATIVE,
    element: <Page404 />,
  },
  {
    path: PATHS.ACCEPT_TEAM_INVITE.RELATIVE,
    element: <ProtectedRoute component={AcceptTeamInvite} />,
  },
  {
    path: PATHS.IMPORT_FROM_CHARLES.RELATIVE,
    element: <ProtectedRoute component={ImportFromCharlesWrapperView} />,
  },
  {
    path: PATHS.IMPORT_FROM_MODHEADER.RELATIVE,
    element: <ProtectedRoute component={ImportFromModheaderWrapperView} />,
  },
  {
    path: PATHS.IMPORT_FROM_HEADER_EDITOR.RELATIVE,
    element: <ProtectedRoute component={HeaderEditorImportScreen} />,
  },
  {
    path: PATHS.IMPORT_FROM_RESOURCE_OVERRIDE.RELATIVE,
    element: <ProtectedRoute component={ImportFromResourceOverrideWrapperView} />,
  },
  {
    path: PATHS.HOME.RELATIVE,
    element: <Home />,
  },
  {
    path: PATHS.APPSUMO.RELATIVE,
    element: <ProtectedRoute component={AppSumoModal} />,
  },
  {
    path: PATHS.SELENIUM_IMPORTER.RELATIVE,
    element: <SeleniumImporter />,
  },
  {
    path: PATHS.GITHUB_STUDENT_DEVELOPER.RELATIVE,
    element: <GithubStudentPack />,
  },
  {
    path: PATHS.ANY,
    element: <Navigate to={PATHS.PAGE404.RELATIVE} />,
  },
];
