import React from "react";

interface StatusSwitchProps {
  checked: boolean;
  onChange: (val: boolean) => void;
  isLoading?: boolean;
}

const StatusSwitch: React.FC<StatusSwitchProps> = ({
  checked,
  onChange,
  isLoading = false,
}) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      if (!isLoading) onChange(!checked);
    }}
    disabled={isLoading}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
      checked ? "bg-green-500" : "bg-gray-200"
    } ${isLoading ? "opacity-50 cursor-wait" : "cursor-pointer"}`}
  >
    <span
      className={`${
        checked ? "translate-x-6" : "translate-x-1"
      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200`}
    />
  </button>
);

export default StatusSwitch;
