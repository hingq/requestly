import React, { useCallback, useEffect, useState } from "react";
import { Row, Tooltip } from "antd";
import { CLIENT_MESSAGES, EXTENSION_MESSAGES } from "../../../constants";
import { PrimaryActionButton } from "../common/PrimaryActionButton";
import SettingIcon from "../../../../resources/icons/setting.svg";
import PlayRecordingIcon from "../../../../resources/icons/playRecording.svg";
import StopRecordingIcon from "../../../../resources/icons/stopRecording.svg";
import ReplayLastFiveMinuteIcon from "../../../../resources/icons/replayLastFiveMinute.svg";
import InfoIcon from "../../../../resources/icons/info.svg";
import ShieldIcon from "../../../../resources/icons/shield.svg";
import config from "../../../config";
import { EVENT, sendEvent } from "../../events";
import "./sessionRecordingView.css";

const SessionRecordingView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<chrome.tabs.Tab>();
  const [isRecordingSession, setIsRecordingSession] = useState<boolean>();
  const [isManualMode, setIsManualMode] = useState<boolean>();
  const currentTabId = activeTab?.id;
  const isRecordingInManualMode = isRecordingSession && isManualMode;

  const startRecordingOnClick = useCallback(() => {
    sendEvent(EVENT.START_RECORDING_CLICKED, { type: "manual" });
    chrome.runtime.sendMessage({
      action: EXTENSION_MESSAGES.START_RECORDING_EXPLICITLY,
      tab: activeTab,
      showWidget: true,
    });
    setIsManualMode(true);
    setIsRecordingSession(true);
  }, [activeTab]);

  const viewRecordingOnClick = useCallback(() => {
    if (isManualMode) {
      sendEvent(EVENT.STOP_RECORDING_CLICKED, { recording_mode: "manual" });
      chrome.runtime.sendMessage({
        action: EXTENSION_MESSAGES.STOP_RECORDING,
        tabId: currentTabId,
        openRecording: true,
      });
      setIsRecordingSession(false);
    } else {
      sendEvent(EVENT.VIEW_RECORDING_CLICKED, { recording_mode: "auto" });
      chrome.runtime.sendMessage({
        action: EXTENSION_MESSAGES.WATCH_RECORDING,
        tabId: currentTabId,
      });
    }
  }, [isManualMode, currentTabId]);

  useEffect(() => {
    chrome.tabs.query({ currentWindow: true, active: true }, ([activeTab]) => {
      setActiveTab(activeTab);
      chrome.tabs.sendMessage(
        activeTab.id,
        { action: CLIENT_MESSAGES.IS_RECORDING_SESSION },
        { frameId: 0 },
        setIsRecordingSession
      );
    });
  }, []);

  useEffect(() => {
    if (currentTabId) {
      chrome.tabs.sendMessage(
        currentTabId,
        {
          action: CLIENT_MESSAGES.IS_EXPLICIT_RECORDING_SESSION,
        },
        { frameId: 0 },
        setIsManualMode
      );
    }
  }, [currentTabId]);

  const handleConfigureBtnClick = useCallback(() => {
    sendEvent(EVENT.SESSION_RECORDINGS_CONFIG_OPENED);
    window.open(`${config.WEB_URL}/settings/sessionbook?source=popup`, "_blank");
  }, []);

  const watchReplayBtnTooltipContent =
    isRecordingInManualMode || !isRecordingSession ? (
      <div className="watch-replay-btn-tooltip-content">
        <InfoIcon />
        <div>
          <span>当前页面未开启自动录制，请前往 SessionBook 设置中启用。</span>{" "}
          <button onClick={handleConfigureBtnClick}>立即启用</button>
        </div>
      </div>
    ) : (
      <>立即回放此标签页最近 5 分钟的自动录制内容。</>
    );

  return (
    <div className="session-view-content">
      <Row align="middle" justify="space-between">
        <div className="title">录制并分享你的浏览会话</div>
        <div className="configure-btn" onClick={handleConfigureBtnClick}>
          <SettingIcon /> 配置
        </div>
      </Row>
      <Row wrap={false} align="middle" className="action-btns">
        <Tooltip
          placement="top"
          color="#000000"
          title="采集鼠标移动、控制台、网络请求等信息。"
          overlayClassName="action-btn-tooltip"
        >
          <PrimaryActionButton
            block
            className={isRecordingInManualMode ? "stop-btn" : ""}
            icon={isRecordingInManualMode ? <StopRecordingIcon /> : <PlayRecordingIcon />}
            onClick={isRecordingInManualMode ? viewRecordingOnClick : startRecordingOnClick}
          >
            {isRecordingInManualMode ? "停止并查看" : "录制当前标签页"}
          </PrimaryActionButton>
        </Tooltip>

        <Tooltip
          placement="top"
          color="#000000"
          title={watchReplayBtnTooltipContent}
          overlayClassName="action-btn-tooltip watch-replay-btn"
        >
          <PrimaryActionButton
            block
            icon={<ReplayLastFiveMinuteIcon />}
            disabled={isRecordingInManualMode || !isRecordingSession}
            onClick={viewRecordingOnClick}
          >
            查看最近 5 分钟回放
          </PrimaryActionButton>
        </Tooltip>
      </Row>
      <div className="session-replay-security-msg">
        <ShieldIcon />
        <div className="msg">录制内容仅保存在你的本地浏览器中。</div>
      </div>
    </div>
  );
};

export default SessionRecordingView;
