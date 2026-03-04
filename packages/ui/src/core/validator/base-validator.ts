/**
 * Abstract base class for all validators
 */

import {
    ValidatorType,
    ValidationResult,
    ValidationIssue,
    ValidatorConfig,
} from "./types";

export abstract class BaseValidator {
    protected type: ValidatorType;
    protected config: ValidatorConfig;

    constructor(type: ValidatorType, config: ValidatorConfig) {
        this.type = type;
        this.config = config;
    }

    /**
     * Main validation method - must be implemented by subclasses
     */
    abstract validate(json: string): ValidationResult;

    /**
     * Parse JSON and handle errors
     */
    protected parseJson(json: string): { parsed?: unknown; error?: string } {
        try {
            return { parsed: JSON.parse(json) };
        } catch (error) {
            return {
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to parse JSON syntax",
            };
        }
    }

    /**
     * Format JSON nicely
     */
    protected formatJson(json: string): string {
        try {
            const parsed = JSON.parse(json);
            return JSON.stringify(parsed, null, 2);
        } catch {
            return json;
        }
    }

    /**
     * Helper to create an issue
     */
    protected createIssue(
        path: string,
        message: string,
        severity: "error" | "warning" | "info" = "error",
        code?: string,
        suggestion?: string
    ): ValidationIssue {
        return { path, message, severity, code, suggestion };
    }

    /**
     * Get validator configuration
     */
    getConfig(): ValidatorConfig {
        return this.config;
    }

    /**
     * Get validator type
     */
    getType(): ValidatorType {
        return this.type;
    }
}
