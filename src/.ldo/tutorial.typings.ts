import { ContextDefinition } from "jsonld";

/**
 * =============================================================================
 * Typescript Typings for tutorial
 * =============================================================================
 */

/**
 * Tutorial Type
 */
export interface Tutorial {
  "@id"?: string;
  "@context"?: ContextDefinition;
  title: string;
  description?: string;
  uploadDate?: string;
  image?: string[];
  tag?: string[];
  hasSupply?: Supply[];
  hasStep?: Step[];
}

/**
 * Supply Type
 */
export interface Supply {
  "@id"?: string;
  "@context"?: ContextDefinition;
  name?: string;
  quantity?: number;
  quantityUnit?: string;
}

/**
 * Step Type
 */
export interface Step {
  "@id"?: string;
  "@context"?: ContextDefinition;
  title?: string;
  description?: string;
  image?: string[];
  attachedFile?: {
    "@id": string;
  }[];
}
