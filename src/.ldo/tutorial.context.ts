import { ContextDefinition } from "jsonld";

/**
 * =============================================================================
 * tutorialContext: JSONLD Context for tutorial
 * =============================================================================
 */
export const tutorialContext: ContextDefinition = {
  title: {
    "@id": "http://example.org/title",
    "@type": "http://www.w3.org/2001/XMLSchema#string",
  },
  description: {
    "@id": "http://example.org/description",
    "@type": "http://www.w3.org/2001/XMLSchema#string",
  },
  uploadDate: {
    "@id": "http://example.org/uploadDate",
    "@type": "http://www.w3.org/2001/XMLSchema#string",
  },
  image: {
    "@id": "http://example.org/image",
    "@type": "http://example.com/image",
    "@container": "@set",
  },
  tag: {
    "@id": "http://example.org/tag",
    "@type": "http://www.w3.org/2001/XMLSchema#string",
    "@container": "@set",
  },
  hasSupply: {
    "@id": "http://example.org/hasSupply",
    "@type": "@id",
    "@container": "@set",
  },
  name: {
    "@id": "http://example.org/name",
    "@type": "http://www.w3.org/2001/XMLSchema#string",
  },
  quantity: {
    "@id": "http://example.org/quantity",
    "@type": "http://www.w3.org/2001/XMLSchema#decimal",
  },
  quantityUnit: {
    "@id": "http://example.org/quantityUnit",
    "@type": "http://www.w3.org/2001/XMLSchema#string",
  },
  hasStep: {
    "@id": "http://example.org/hasStep",
    "@type": "@id",
    "@container": "@set",
  },
  attachedFile: {
    "@id": "http://example.org/attachedFile",
    "@type": "@id",
    "@container": "@set",
  },
};
