/**
 * Core validator types and interfaces
 */

export type ValidatorType = "generic" | "txadmin-embed" | "txadmin-config";

export type IssueSeverity = "error" | "warning" | "info";

/**
 * Represents a single validation issue
 */
export interface ValidationIssue {
    path: string;
    message: string;
    severity: IssueSeverity;
    code?: string;
    suggestion?: string;
}

/**
 * Represents the result of validation
 */
export interface ValidationResult {
    valid: boolean;
    type: ValidatorType;
    issues: ValidationIssue[];
    formatted?: string;
    parseError?: string;
    metadata?: {
        validationTime?: number;
        characterCount?: number;
        lineCount?: number;
    };
}

/**
 * Validator configuration and metadata
 */
export interface ValidatorConfig {
    type: ValidatorType;
    label: string;
    description: string;
    icon?: string;
    placeholders?: ValidatorPlaceholder[];
    limits?: Record<string, number>;
    sampleJson?: string;
}

/**
 * Placeholder information for templates
 */
export interface ValidatorPlaceholder {
    name: string;
    description: string;
    example?: string;
}

/**
 * Validator info response from API
 */
export interface ValidatorInfoResponse {
    types: ValidatorConfig[];
    placeholders: Record<ValidatorType, ValidatorPlaceholder[]>;
    limits: {
        embed: Record<string, number>;
        config: Record<string, number>;
    };
}

/**
 * Validation request/response for server communication
 */
export interface ValidationRequest {
    json: string;
    type: ValidatorType;
}

export interface ValidationResponse {
    success: boolean;
    result?: ValidationResult;
    error?: string;
}
