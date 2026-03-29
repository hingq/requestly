import { Tooltip } from "antd";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { getDesktopSpecificDetails } from "store/selectors";
import "./proxyServerStatusIcon.scss";
import { getAppMessage } from "i18n";

interface ProxyServerStatusIconProps {
  showTooltip: boolean;
}

export const ProxyServerStatusIcon: React.FC<ProxyServerStatusIconProps> = ({ showTooltip }) => {
  const desktopSpecificDetails = useSelector(getDesktopSpecificDetails);
  const { isBackgroundProcessActive, isProxyServerRunning, proxyPort, proxyIp } = desktopSpecificDetails;

  const tooltipTitle = useMemo(() => {
    if (!isBackgroundProcessActive) {
      return <>{getAppMessage("proxy.waitingToStart")}</>;
    }
    if (isProxyServerRunning) {
      return (
        <div className="text-center proxy-server-status-tooltip-text">
          {getAppMessage("proxy.runningAt")}{" "}
          <div className="proxy-server-status-tooltip-text__port">
            {proxyIp}:{proxyPort}
          </div>
        </div>
      );
    }
    return <>{getAppMessage("proxy.notRunning")}</>;
  }, [isBackgroundProcessActive, isProxyServerRunning, proxyIp, proxyPort]);

  return (
    <Tooltip showArrow={false} color="#000" title={showTooltip ? tooltipTitle : ""} placement="bottom">
      {isBackgroundProcessActive ? (
        isProxyServerRunning ? (
          <img src="/assets/media/common/proxyActive.svg" alt={getAppMessage("proxy.activeAlt")} />
        ) : (
          <img src="/assets/media/common/proxyInactive.svg" alt={getAppMessage("proxy.inactiveAlt")} />
        )
      ) : null}
    </Tooltip>
  );
};
