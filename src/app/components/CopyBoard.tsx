import React, { useContext, useState } from "react";
import { ThemeContext } from "./ThemeProvider";

export default function CopyBoard({ json }: { json: string; }) {
  const { theme, toogleTheme } = useContext(ThemeContext);

  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(json).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const backgroundColor = theme === "dark" ? "bg-gray-700" : "bg-gray-50";
  const textColor = theme === "dark" ? "text-gray-400" : "text-gray-500";
  const buttonBgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
  const buttonTextColor = theme === "dark" ? "text-gray-400" : "text-gray-900";
  const buttonBorderColor = theme === "dark" ? "border-gray-600" : "border-gray-200";
  const buttonHoverBgColor = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100";
  const copiedTextColor = theme === "dark" ? "text-blue-500" : "text-blue-700";

  return (
    <div className="w-full max-w-lg">
      <div className={`relative rounded-lg p-4 ${backgroundColor}`}>
        <div className="overflow-auto max-h-64">
          <pre>
            <code id="code-block" className={`text-sm whitespace-pre ${textColor}`}>
              {json}
            </code>
          </pre>
        </div>
        <div className={`absolute top-2 right-2 ${backgroundColor}`}>
          <button
            className={`m-0.5 py-2 px-2.5 inline-flex items-center justify-center rounded-lg border ${buttonBgColor} ${buttonTextColor} ${buttonBorderColor} ${buttonHoverBgColor}`}
            onClick={handleCopy}
          >
            {!copied && (
              <span id="default-message" className="inline-flex items-center">
                <svg
                  className="w-3 h-3 mr-1.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 18 20"
                >
                  <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
                </svg>
                <span className="text-xs font-semibold">Copy code</span>
              </span>
            )}
            {copied && (
              <span id="success-message" className="inline-flex items-center">
                <svg
                  className={`w-3 h-3 mr-1.5 ${copiedTextColor}`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 16 12"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={"2"}
                    d="M1 5.917 5.724 10.5 15 1.5"
                  />
                </svg>
                <span className={`text-xs font-semibold ${copiedTextColor}`}>Copied</span>
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
