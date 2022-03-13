import { FC, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

interface QueryTab {
  title?: string;
  value: string;
}

interface QueryTabsProps {
  tabs: QueryTab[];
  onTabSelect?: (tab: QueryTab) => void;
  tabKey?: string;
  /** If true, avoids setting searchParam to the first tab if no tab was specified. */
  ignoreMissing?: boolean;
}

const QueryTabs: FC<QueryTabsProps> = ({
  tabKey = "tab",
  tabs,
  ignoreMissing = false,
  onTabSelect = () => ({}),
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get(tabKey);
  const selected = tabs.find((t) => t.value === tab);

  // Set the default tab if none was specified.
  useEffect(() => {
    if (!ignoreMissing && !selected && tabs.length > 0) {
      setSearchParams({ [tabKey]: tabs[0].value });
    }
  }, [ignoreMissing, selected, tabs, setSearchParams, tabKey]);

  // Notify callback of a change to the selected tab.
  useEffect(() => {
    if (selected) {
      onTabSelect(selected);
    }
  }, [selected, onTabSelect]);

  return (
    <div className="flex mb-3 w-full">
      {tabs.map(({ value, title }) => (
        <div
          key={value}
          className={
            "w-full text-center font-semibold my-1 mr-1 cursor-pointer px-6 py-1 rounded hover:bg-slate-200 " +
            (value === (selected && selected.value)
              ? " text-slate-900 bg-slate-100 "
              : " text-slate-500")
          }
          onClick={() => setSearchParams({ tab: value })}
        >
          {title || value}
        </div>
      ))}
    </div>
  );
};

export default QueryTabs;
