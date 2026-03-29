import React, { useCallback } from "react";
import { LINKS } from "../../../constants";
import { Rule } from "../../../types";
import RuleItem from "../common/RuleItem";
import { updateItemInCollection } from "../../utils";
import TabContentSection from "../common/TabContentSection";
import { PrimaryActionButton } from "../common/PrimaryActionButton";
import { EmptyPopupTab } from "../PopupTabs/EmptyPopupTab";

interface ExecutedRulesProps {
  executedRules: Rule[];
  setExecutedRules: React.Dispatch<React.SetStateAction<Rule[]>>;
}

const ExecutedRules: React.FC<ExecutedRulesProps> = ({ executedRules, setExecutedRules }) => {
  const updateExecutedRule = useCallback((updatedRule: Rule) => {
    setExecutedRules((executedRules) => updateItemInCollection<Rule>(executedRules, updatedRule));
  }, []);

  return executedRules.length > 0 ? (
    <TabContentSection heading="此标签页中已执行的规则：">
      <ul className="record-list">
        {executedRules.map((rule) => (
          <RuleItem rule={rule} key={rule.id} onRuleUpdated={updateExecutedRule} />
        ))}
      </ul>
    </TabContentSection>
  ) : (
    <EmptyPopupTab
      title="此标签页没有执行任何规则"
      description={
        <>
          已执行的规则会显示在这里。
          <br /> 如果遇到问题，请查看故障排查指南。
        </>
      }
      actionButton={
        <PrimaryActionButton
          size="small"
          onClick={() => window.open(LINKS.REQUESTLY_EXTENSION_TROUBLESHOOTING, "_blank")}
        >
          查看排查指南
        </PrimaryActionButton>
      }
    />
  );
};

export default ExecutedRules;
