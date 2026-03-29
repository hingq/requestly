// Import Libraries
import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import { ConfigProvider, Tabs, theme } from "antd";
import zhCN from "antd/lib/locale/zh_CN";

// Import Styles
import "./index.scss";
import { ThemeProvider } from "@devtools-ds/themes";

// Import Custom Components
import { ColorScheme } from "./types";
import { getCurrentColorScheme, onColorSchemeChange } from "./utils";
import useLocalStorageState from "./hooks/useLocalStorageState";
import { EVENT, sendEvent } from "./events";

// Import All Containers
import NetworkContainer from "./containers/network/NetworkContainer";
import ExecutionsContainer from "./containers/executions/ExecutionsContainer";
import AnalyticsInspectorContainer from "./containers/analytics-inspector/AnalyticsInspectorContainer";

// Todo @Sachin: Remove this after confirming with team that this is not needed
sendEvent(EVENT.DEVTOOL_OPENED);

const token = {
  borderRadius: 4,
  fontSize: 13,
};

enum DevtoolsTabKeys {
  NETWORK = "network",
  EXECUTIONS = "executions",
  ANALYTICS_INSPECTOR = "analytics-inspector",
}

const App: React.FC = () => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>(getCurrentColorScheme());
  const [selectedTab, setSelectedTab] = useLocalStorageState("lastTab", DevtoolsTabKeys.NETWORK);

  useEffect(() => {
    onColorSchemeChange(setColorScheme);
  }, []);

  useEffect(() => {
    sendEvent(EVENT.DEVTOOL_TAB_SELECTED, { tab: selectedTab });
  }, [selectedTab]);

  const antDesignTheme = useMemo(() => {
    let algorithm = [theme.compactAlgorithm];

    if (colorScheme === ColorScheme.DARK) {
      algorithm.push(theme.darkAlgorithm);
    }

    return { token, algorithm };
  }, [colorScheme]);

  return (
    <ConfigProvider locale={zhCN} theme={antDesignTheme}>
      <ThemeProvider theme={"chrome"} colorScheme={colorScheme}>
        <Tabs
          className="devtools-tabs"
          activeKey={selectedTab}
          onChange={setSelectedTab}
          tabPosition="left"
          tabBarStyle={{ minWidth: 150 }}
          tabBarGutter={0}
          items={[
            {
              label: "网络流量",
              key: DevtoolsTabKeys.NETWORK,
              children: <NetworkContainer />,
              forceRender: true,
            },
            {
              label: "规则执行",
              key: DevtoolsTabKeys.EXECUTIONS,
              children: <ExecutionsContainer />,
              forceRender: true,
            },
            {
              label: "分析检查",
              key: DevtoolsTabKeys.ANALYTICS_INSPECTOR,
              children: <AnalyticsInspectorContainer />,
              forceRender: true,
            },
          ]}
        />
      </ThemeProvider>
    </ConfigProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
