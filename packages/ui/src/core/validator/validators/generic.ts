/**
 * Generic JSON validator - validates basic JSON syntax
 */

import { BaseValidator } from "../base-validator";
import { ValidationResult, ValidatorConfig } from "../types";

export class GenericJsonValidator extends BaseValidator {
    constructor() {
        const config: ValidatorConfig = {
            type: "generic",
            label: "Generic JSON",
            description: "Validate any JSON structure",
            icon: "braces",
        };
        super("generic", config);
    }

    validate(json: string): ValidationResult {
        const startTime = performance.now();
        const result: ValidationResult = {
            valid: false,
            type: "generic",
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

        // Format the valid JSON
        result.formatted = this.formatJson(trimmedJson);
        result.valid = true;
        result.metadata!.validationTime = performance.now() - startTime;

        return result;
    }
}
