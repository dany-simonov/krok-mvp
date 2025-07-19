import React from "react";
import { Code2 } from "lucide-react";
import clsx from "clsx";

export const FunctionNode: React.FC<{ name?: string; health?: number }> = ({
  name,
  health,
}) => {
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center w-full",
        "bg-green-50 border-2 border-green-300 rounded-lg shadow p-1 min-w-[90px] max-w-[120px]"
      )}
    >
      <Code2 className="h-6 w-6 text-green-600 mb-0.5" />
      <span className="font-bold text-green-900 text-xs mb-0.5">
        {name || "Function"}
      </span>
      {typeof health === "number" && (
        <div className="mt-1 w-full flex items-center gap-1">
          <div className="flex-1 bg-green-300 rounded-full h-1.5">
            <div
              className={clsx(
                "h-1.5 rounded-full",
                health > 80
                  ? "bg-green-500"
                  : health > 60
                  ? "bg-yellow-500"
                  : "bg-red-500"
              )}
              style={{ width: `${health}%` }}
            />
          </div>
          <span className="text-[10px] text-green-900 font-semibold ml-1">
            {health}%
          </span>
        </div>
      )}
    </div>
  );
};
