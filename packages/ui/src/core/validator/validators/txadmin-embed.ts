/**
 * txAdmin Embed validator - validates Discord embed JSON for txAdmin
 */

import { BaseValidator } from "../base-validator";
import { ValidationResult, ValidatorConfig, ValidationIssue } from "../types";

interface DiscordEmbed {
    title?: string;
    description?: string;
    fields?: Array<{ name: string; value: string; inline?: boolean }>;
    url?: string;
    timestamp?: string;
    color?: number | string;
    footer?: { text: string; icon_url?: string };
    image?: { url: string };
    thumbnail?: { url: string };
    author?: { name: string; url?: string; icon_url?: string };
}

export class TxAdminEmbedValidator extends BaseValidator {
    private static readonly LIMITS = {
        titleMaxLength: 256,
        descriptionMaxLength: 4096,
        fieldNameMaxLength: 256,
        fieldValueMaxLength: 1024,
        fieldMaxCount: 25,
        footerMaxLength: 2048,
        totalFieldsCharsLimit: 6000,
    };

    constructor() {
        const config: ValidatorConfig = {
            type: "txadmin-embed",
            label: "txAdmin Embed",
            description: "Validate Discord embed configuration for txAdmin",
            icon: "bot",
            limits: TxAdminEmbedValidator.LIMITS,
            placeholders: [
                { name: "serverName", description: "Server name" },
                { name: "serverClients", description: "Players online" },
                { name: "serverMaxClients", description: "Max players" },
                { name: "statusString", description: "Status text" },
                { name: "uptime", description: "Server uptime" },
                { name: "nextScheduledRestart", description: "Next restart time" },
                { name: "serverJoinUrl", description: "Server join URL" },
                { name: "serverBrowserUrl", description: "Server browser URL" },
                { name: "serverCfxId", description: "Cfx.re server ID" },
                { name: "statusColor", description: "Status color (hex)" },
            ],
        };
        super("txadmin-embed", config);
    }

    validate(json: string): ValidationResult {
        const startTime = performance.now();
        const result: ValidationResult = {
            valid: false,
            type: "txadmin-embed",
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

        const embed = parseResult.parsed as DiscordEmbed;

        // Validate embed structure
        this.validateEmbedStructure(embed, result.issues);
        this.validateEmbedLimits(embed, result.issues);
        this.validatePlaceholders(trimmedJson, result.issues);

        result.formatted = this.formatJson(trimmedJson);
        result.valid = result.issues.filter((i) => i.severity === "error").length === 0;
        result.metadata!.validationTime = performance.now() - startTime;

        return result;
    }

    private validateEmbedStructure(embed: DiscordEmbed, issues: ValidationIssue[]) {
        if (typeof embed !== "object" || embed === null) {
            issues.push(
                this.createIssue("$", "Embed must be a valid JSON object", "error")
            );
            return;
        }

        // Check if at least something is provided
        if (!embed.title && !embed.description && !embed.fields) {
            issues.push(
                this.createIssue(
                    "$",
                    "Embed should have at least title, description, or fields",
                    "warning"
                )
            );
        }

        // Validate fields array
        if (embed.fields) {
            if (!Array.isArray(embed.fields)) {
                issues.push(
                    this.createIssue(
                        "$.fields",
                        "Fields must be an array",
                        "error"
                    )
                );
            } else if (embed.fields.length > TxAdminEmbedValidator.LIMITS.fieldMaxCount) {
                issues.push(
                    this.createIssue(
                        "$.fields",
                        `Fields array cannot exceed ${TxAdminEmbedValidator.LIMITS.fieldMaxCount} items`,
                        "error"
                    )
                );
            } else {
                embed.fields.forEach((field, idx) => {
                    const path = `$.fields[${idx}]`;
                    if (!field.name || !field.value) {
                        issues.push(
                            this.createIssue(
                                path,
                                "Field must have both 'name' and 'value' properties",
                                "error"
                            )
                        );
                    }
                });
            }
        }
    }

    private validateEmbedLimits(embed: DiscordEmbed, issues: ValidationIssue[]) {
        const limits = TxAdminEmbedValidator.LIMITS;

        if (embed.title && embed.title.length > limits.titleMaxLength) {
            issues.push(
                this.createIssue(
                    "$.title",
                    `Title exceeds maximum length of ${limits.titleMaxLength} characters`,
                    "error",
                    "TITLE_TOO_LONG",
                    `Current length: ${embed.title.length}`
                )
            );
        }

        if (embed.description && embed.description.length > limits.descriptionMaxLength) {
            issues.push(
                this.createIssue(
                    "$.description",
                    `Description exceeds maximum length of ${limits.descriptionMaxLength} characters`,
                    "error",
                    "DESC_TOO_LONG",
                    `Current length: ${embed.description.length}`
                )
            );
        }

        if (embed.fields) {
            embed.fields.forEach((field, idx) => {
                const path = `$.fields[${idx}]`;

                if (field.name && field.name.length > limits.fieldNameMaxLength) {
                    issues.push(
                        this.createIssue(
                            `${path}.name`,
                            `Field name exceeds ${limits.fieldNameMaxLength} characters`,
                            "error"
                        )
                    );
                }

                if (field.value && field.value.length > limits.fieldValueMaxLength) {
                    issues.push(
                        this.createIssue(
                            `${path}.value`,
                            `Field value exceeds ${limits.fieldValueMaxLength} characters`,
                            "error"
                        )
                    );
                }
            });
        }

        if (embed.footer && embed.footer.text && embed.footer.text.length > limits.footerMaxLength) {
            issues.push(
                this.createIssue(
                    "$.footer.text",
                    `Footer text exceeds ${limits.footerMaxLength} characters`,
                    "error"
                )
            );
        }
    }

    private validatePlaceholders(json: string, issues: ValidationIssue[]) {
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
                        "warning",
                        "UNKNOWN_PLACEHOLDER",
                        `Valid placeholders: ${Array.from(validPlaceholders).join(", ")}`
                    )
                );
            }
        }
    }
}
