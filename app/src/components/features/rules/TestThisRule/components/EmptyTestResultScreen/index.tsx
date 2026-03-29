import { Col } from "antd";
import "./index.scss";
import { getAppMessage } from "i18n";

export const EmptyTestResultScreen = () => {
  return (
    <Col className="empty-test-result-container">
      <img src={"/assets/media/components/empty-folder.svg"} alt="Empty folder" />
      <Col className="mt-16">
        <div className="text-center text-bold">{getAppMessage("rules.emptyTestResultTitle")}</div>
        <div className="mt-8 text-center">{getAppMessage("rules.emptyTestResultDescription")}</div>
      </Col>
    </Col>
  );
};
