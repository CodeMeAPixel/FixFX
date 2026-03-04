/**
 * Validator registry - manages all available validators
 */

import { BaseValidator } from "./base-validator";
import { ValidatorType, ValidatorConfig } from "./types";
import { GenericJsonValidator } from "./validators/generic";
import { TxAdminEmbedValidator } from "./validators/txadmin-embed";
import { TxAdminConfigValidator } from "./validators/txadmin-config";

export class ValidatorRegistry {
    private static validators: Map<ValidatorType, BaseValidator> = new Map();
    private static initialized = false;

    /**
     * Initialize all validators
     */
    static initialize() {
        if (this.initialized) return;

        this.register(new GenericJsonValidator());
        this.register(new TxAdminEmbedValidator());
        this.register(new TxAdminConfigValidator());

        this.initialized = true;
    }

    /**
     * Register a validator
     */
    private static register(validator: BaseValidator) {
        this.validators.set(validator.getType(), validator);
    }

    /**
     * Get a validator by type
     */
    static getValidator(type: ValidatorType): BaseValidator | undefined {
        this.initialize();
        return this.validators.get(type);
    }

    /**
     * Get all validator configurations
     */
    static getAllConfigs(): ValidatorConfig[] {
        this.initialize();
        return Array.from(this.validators.values()).map((v) => v.getConfig());
    }

    /**
     * Get all validators
     */
    static getAllValidators(): BaseValidator[] {
        this.initialize();
        return Array.from(this.validators.values());
    }

    /**
     * Get consolidated placeholder map
     */
    static getPlaceholders(): Record<ValidatorType, Array<{ name: string; description: string; example?: string }>> {
        this.initialize();
        const placeholders: Record<ValidatorType, Array<{ name: string; description: string; example?: string }>> = {
            "generic": [],
            "txadmin-embed": [],
            "txadmin-config": [],
        };

        this.validators.forEach((validator) => {
            const config = validator.getConfig();
            if (config.placeholders) {
                placeholders[config.type as ValidatorType] = config.placeholders;
            }
        });

        return placeholders;
    }

    /**
     * Get consolidated limits
     */
    static getLimits() {
        this.initialize();
        const embed = this.validators.get("txadmin-embed");
        const config = this.validators.get("txadmin-config");

        return {
            embed: embed?.getConfig().limits || {},
            config: config?.getConfig().limits || {},
        };
    }
}
