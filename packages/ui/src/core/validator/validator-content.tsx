"use client";

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { ValidatorRegistry } from "./registry";
import { ValidatorType, ValidationResult } from "./types";
import {
  ValidatorHeader,
  EditorPanel,
  ResultsPanel,
  ValidatorSidebar,
} from "./components";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

// Sample JSONs
const SAMPLE_JSONS: Record<ValidatorType, string> = {
  generic: JSON.stringify({ example: "value" }, null, 2),
  "txadmin-embed": `{
    "title": "{{serverName}}",
    "url": "{{serverBrowserUrl}}",
    "description": "Server status",
    "fields": [
        {
            "name": "> STATUS",
            "value": "\`\`\`\n{{statusString}}\n\`\`\`",
            "inline": true
        },
        {
            "name": "> PLAYERS",
            "value": "\`\`\`\n{{serverClients}}/{{serverMaxClients}}\n\`\`\`",
            "inline": true
        }
    ]
}`,
  "txadmin-config": `{
    "onlineString": "Online",
    "onlineColor": "#0BA70B",
    "partialString": "Partial",
    "partialColor": "#FFF100",
    "offlineString": "Offline",
    "offlineColor": "#A70B28",
    "buttons": [
        {
            "emoji": "1062338355909640233",
            "label": "Connect",
            "url": "{{serverJoinUrl}}"
        }
    ]
}`,
};

export function ValidatorContent() {
  const [jsonInput, setJsonInput] = useState("");
  const [validationType, setValidationType] = useState<ValidatorType>("generic");
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  ValidatorRegistry.initialize();
  const validatorConfigs = useMemo(() => ValidatorRegistry.getAllConfigs(), []);
  const placeholders = useMemo(() => ValidatorRegistry.getPlaceholders(), []);
  const currentTypeLabel =
    validatorConfigs.find((c) => c.type === validationType)?.label || "Generic JSON";

  const validate = useCallback(async () => {
    if (!jsonInput.trim()) return;
    setIsValidating(true);
    try {
      const validator = ValidatorRegistry.getValidator(validationType);
      if (validator) {
        setResult(validator.validate(jsonInput));
      }
    } catch (err) {
      console.error("Validation error:", err);
    } finally {
      setIsValidating(false);
    }
  }, [jsonInput, validationType]);

  const handleFormat = useCallback(() => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed, null, 2));
    } catch {
      validate();
    }
  }, [jsonInput, validate]);

  const handleClear = useCallback(() => {
    setJsonInput("");
    setResult(null);
  }, []);

  const handleLoadTemplate = useCallback((type: ValidatorType) => {
    setValidationType(type);
    setJsonInput(SAMPLE_JSONS[type]);
    setResult(null);
  }, []);

  const handlePlaceholderInsert = useCallback((placeholder: string) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const newValue = jsonInput.substring(0, start) + placeholder + jsonInput.substring(end);
      setJsonInput(newValue);
      setTimeout(() => {
        if (textareaRef.current) {
          const newPos = start + placeholder.length;
          textareaRef.current.selectionStart = newPos;
          textareaRef.current.selectionEnd = newPos;
          textareaRef.current.focus();
        }
      }, 0);
    }
  }, [jsonInput]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        validate();
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "F") {
        e.preventDefault();
        handleFormat();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [validate, handleFormat]);

  return (
    <div className="relative flex min-h-screen h-screen bg-fd-background overflow-hidden">
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl opacity-50" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl opacity-50" />
      </div>

      <ValidatorSidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileSidebarOpen}
        onMobileOpenChange={setMobileSidebarOpen}
        validationType={validationType}
        onValidationTypeChange={(type) => {
          setValidationType(type);
          setResult(null);
          setMobileSidebarOpen(false);
        }}
        validatorConfigs={validatorConfigs}
        placeholders={placeholders}
        onTemplateSelect={(type) => {
          handleLoadTemplate(type);
          setMobileSidebarOpen(false);
        }}
        textareaRef={textareaRef}
        onPlaceholderInsert={(p) => {
          handlePlaceholderInsert(p);
          setMobileSidebarOpen(false);
        }}
      />

      <main className="flex-1 h-full flex flex-col overflow-hidden">
        <ValidatorHeader
          validationType={validationType}
          onValidate={validate}
          onFormat={handleFormat}
          onClear={handleClear}
          isValidating={isValidating}
          hasInput={jsonInput.trim().length > 0}
          typeLabel={currentTypeLabel}
          onMobileMenuOpen={() => setMobileSidebarOpen(true)}
        />

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          <EditorPanel
            value={jsonInput}
            onChange={(value) => {
              setJsonInput(value);
              if (result) setResult(null);
            }}
            isInvalid={result?.valid === false}
            textareaRef={textareaRef}
          />
          <ResultsPanel result={result} />
        </div>
      </main>
    </div>
  );
}
