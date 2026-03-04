/**
 * txAdmin Config validator - validates txAdmin webhook configuration JSON
 */

import { BaseValidator } from "../base-validator";
import { ValidationResult, ValidatorConfig, ValidationIssue } from "../types";

interface TxAdminConfig {
    onlineString?: string;
    onlineColor?: string;
    partialString?: string;
    partialColor?: string;
    offlineString?: string;
    offlineColor?: string;
    buttons?: Array<{
        emoji?: string;
        label?: string;
        url?: string;
    }>;
}

export class TxAdminConfigValidator extends BaseValidator {
    private static readonly LIMITS = {
        stringMaxLength: 256,
        colorMaxLength: 7,
        emojiMaxLength: 32,
        labelMaxLength: 80,
        urlMaxLength: 255,
        maxButtons: 5,
    };

    constructor() {
        const config: ValidatorConfig = {
            type: "txadmin-config",
            label: "txAdmin Config",
            description: "Validate txAdmin webhook configuration",
            icon: "file-json",
            limits: TxAdminConfigValidator.LIMITS,
            placeholders: [
                { name: "serverJoinUrl", description: "Server join URL" },
                { name: "serverBrowserUrl", description: "Server browser URL" },
            ],
        };
        super("txadmin-config", config);
    }

    validate(json: string): ValidationResult {
        const startTime = performance.now();
        const result: ValidationResult = {
            valid: false,
            type: "txadmin-config",
            issues: [],
            metadata: {
                characterCount: json.length,
                lineCount: json.split("\n").length,
            },
        };

        const trimmedJson = json.trim();
        if (!trimmedJson) {
            result.parseError = "JSON input is empty";
            result.metadata!.validationTime = performance.now() - startTime;
            return result;
        }

        const parseResult = this.parseJson(trimmedJson);
        if (parseResult.error) {
            result.parseError = parseResult.error;
            result.metadata!.validationTime = performance.now() - startTime;
            return result;
        }

        const config = parseResult.parsed as TxAdminConfig;

        // Validate config structure
        this.validateConfigStructure(config, result.issues);
        this.validateConfigLimits(config, result.issues);
        this.validateUrls(trimmedJson, result.issues);

        result.formatted = this.formatJson(trimmedJson);
        result.valid = result.issues.filter((i) => i.severity === "error").length === 0;
        result.metadata!.validationTime = performance.now() - startTime;

        return result;
    }

    private validateConfigStructure(config: TxAdminConfig, issues: ValidationIssue[]) {
        if (typeof config !== "object" || config === null) {
            issues.push(
                this.createIssue("$", "Config must be a valid JSON object", "error")
            );
            return;
        }

        // Validate status strings and colors
        const statuses = [
            { string: "onlineString", color: "onlineColor" },
            { string: "partialString", color: "partialColor" },
            { string: "offlineString", color: "offlineColor" },
        ];

        statuses.forEach(({ string, color }) => {
            if (config[string as keyof TxAdminConfig]) {
                if (!config[color as keyof TxAdminConfig]) {
                    issues.push(
                        this.createIssue(
                            "$",
                            `${string} should have a corresponding ${color}`,
                            "warning"
                        )
                    );
                }
            }
        });

        // Validate buttons array
        if (config.buttons) {
            if (!Array.isArray(config.buttons)) {
                issues.push(
                    this.createIssue(
                        "$.buttons",
                        "Buttons must be an array",
                        "error"
                    )
                );
            } else if (config.buttons.length > TxAdminConfigValidator.LIMITS.maxButtons) {
                issues.push(
                    this.createIssue(
                        "$.buttons",
                        `Cannot exceed ${TxAdminConfigValidator.LIMITS.maxButtons} buttons`,
                        "error"
                    )
                );
            } else {
                config.buttons.forEach((btn, idx) => {
                    const path = `$.buttons[${idx}]`;
                    if (!btn.label || !btn.url) {
                        issues.push(
                            this.createIssue(
                                path,
                                "Button must have both 'label' and 'url'",
                                "error"
                            )
                        );
                    }
                });
            }
        }
    }

    private validateConfigLimits(config: TxAdminConfig, issues: ValidationIssue[]) {
        const limits = TxAdminConfigValidator.LIMITS;

        // Check status strings
        ["onlineString", "partialString", "offlineString"].forEach((key) => {
            const value = config[key as keyof TxAdminConfig];
            if (typeof value === "string" && value.length > limits.stringMaxLength) {
                issues.push(
                    this.createIssue(
                        `$.${key}`,
                        `String exceeds ${limits.stringMaxLength} characters`,
                        "error"
                    )
                );
            }
        });

        // Check colors
        ["onlineColor", "partialColor", "offlineColor"].forEach((key) => {
            const value = config[key as keyof TxAdminConfig];
            if (typeof value === "string") {
                if (!this.isValidColor(value)) {
                    issues.push(
                        this.createIssue(
                            `$.${key}`,
                            "Invalid color format. Use hex (e.g., #FF0000)",
                            "error"
                        )
                    );
                }
                if (value.length > limits.colorMaxLength) {
                    issues.push(
                        this.createIssue(
                            `$.${key}`,
                            `Color exceeds ${limits.colorMaxLength} characters`,
                            "error"
                        )
                    );
                }
            }
        });

        // Check buttons
        if (config.buttons && Array.isArray(config.buttons)) {
            config.buttons.forEach((btn, idx) => {
                const path = `$.buttons[${idx}]`;

                if (btn.label && btn.label.length > limits.labelMaxLength) {
                    issues.push(
                        this.createIssue(
                            `${path}.label`,
                            `Label exceeds ${limits.labelMaxLength} characters`,
                            "error"
                        )
                    );
                }

                if (btn.url && btn.url.length > limits.urlMaxLength) {
                    issues.push(
                        this.createIssue(
                            `${path}.url`,
                            `URL exceeds ${limits.urlMaxLength} characters`,
                            "error"
                        )
                    );
                }

                if (btn.emoji && btn.emoji.length > limits.emojiMaxLength) {
                    issues.push(
                        this.createIssue(
                            `${path}.emoji`,
                            `Emoji exceeds ${limits.emojiMaxLength} characters`,
                            "error"
                        )
                    );
                }
            });
        }
    }

    private validateUrls(json: string, issues: ValidationIssue[]) {
        const placeholderPattern = /\{\{(\w+)\}\}/g;
        const validPlaceholders = new Set(
            this.config.placeholders?.map((p) => p.name) || []
        );

        let match;
        while ((match = placeholderPattern.exec(json)) !== null) {
            const placeholder = match[1];
            if (!validPlaceholders.has(placeholder)) {
                issues.push(
                    this.createIssue(
                        "$",
                        `Unknown placeholder: {{${placeholder}}}`,
                        "warning"
                    )
                );
            }
        }
    }

    private isValidColor(color: string): boolean {
        // Check hex format
        return /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(color);
    }
}
