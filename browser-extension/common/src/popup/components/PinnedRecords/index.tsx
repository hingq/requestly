import React from "react";
import RuleItem from "../common/RuleItem";
import GroupItem from "../common/GroupItem";
import TabContentSection from "../common/TabContentSection";
import { useRecords } from "../../contexts/RecordsContext";
import { EmptyPopupTab } from "../PopupTabs/EmptyPopupTab";
import { PrimaryActionButton } from "../common/PrimaryActionButton";
import { PopupTabKey } from "../PopupTabs";
import "./pinnedRecords.css";

interface Props {
  setActiveTabKey: (key: PopupTabKey) => void;
}

const PinnedRecords: React.FC<Props> = ({ setActiveTabKey }) => {
  const { pinnedRules, pinnedGroups } = useRecords();

  return !pinnedGroups.length && !pinnedRules.length ? (
    <EmptyPopupTab
      title="你还没有固定任何规则"
      description="你可以固定最近使用的规则，方便快速访问。"
      actionButton={
        <PrimaryActionButton size="small" onClick={() => setActiveTabKey(PopupTabKey.RECENTLY_USED)}>
          查看最近使用的规则
        </PrimaryActionButton>
      }
    />
  ) : (
    <TabContentSection>
      <ul className="record-list">
        {pinnedGroups.map((group) => (
          <GroupItem key={group.id} group={group} />
        ))}
        {pinnedRules.map((rule) => (
          <RuleItem key={rule.id} rule={rule} isParentPinnedRecords={true} />
        ))}
      </ul>
    </TabContentSection>
  );
};

export default PinnedRecords;
