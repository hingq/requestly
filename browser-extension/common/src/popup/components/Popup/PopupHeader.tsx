import React, { useCallback } from "react";
import { Button, Col, Row, Switch, Typography, Tooltip } from "antd";
import config from "../../../config";
import { EVENT, sendEvent } from "../../events";

interface PopupHeaderProps {
  isExtensionEnabled: boolean;
  handleToggleExtensionStatus: (newStatus: boolean) => void;
}

const PopupHeader: React.FC<PopupHeaderProps> = ({ isExtensionEnabled, handleToggleExtensionStatus }) => {
  const onOpenAppButtonClick = useCallback(() => {
    window.open(`${config.WEB_URL}?source=popup`, "_blank");
    sendEvent(EVENT.OPEN_APP_CLICKED);
  }, []);

  return (
    <div className="popup-header">
      <div className="popup-header-workspace-section">
        <img className="product-logo" src="/resources/images/48x48.png" />
      </div>

      <Row align="middle" gutter={16}>
        <Col>
          <Row align="middle">
            <Tooltip
              open={!isExtensionEnabled}
              title="请开启 Requestly 扩展。暂停后，规则将不会生效，录制也不会进行。"
              overlayClassName="enable-extension-tooltip"
              color="var(--neutrals-black)"
              overlayInnerStyle={{ fontSize: "14px" }}
            >
              <Switch
                checked={isExtensionEnabled}
                onChange={handleToggleExtensionStatus}
                size="small"
                className="pause-switch"
              />
            </Tooltip>
            <Typography.Text>{`Requestly ${isExtensionEnabled ? "运行中" : "已暂停"}`}</Typography.Text>
          </Row>
        </Col>
        <Col>
          <Button type="primary" className="open-app-btn" onClick={onOpenAppButtonClick}>
            打开应用
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default PopupHeader;
