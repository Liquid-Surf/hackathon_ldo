import { ShapeType } from "@ldo/ldo";
import { tutorialSchema } from "./tutorial.schema";
import { tutorialContext } from "./tutorial.context";
import { Tutorial, Supply, Step } from "./tutorial.typings";

/**
 * =============================================================================
 * LDO ShapeTypes tutorial
 * =============================================================================
 */

/**
 * Tutorial ShapeType
 */
export const TutorialShapeType: ShapeType<Tutorial> = {
  schema: tutorialSchema,
  shape: "http://example.org/Tutorial",
  context: tutorialContext,
};

/**
 * Supply ShapeType
 */
export const SupplyShapeType: ShapeType<Supply> = {
  schema: tutorialSchema,
  shape: "http://example.org/Supply",
  context: tutorialContext,
};

/**
 * Step ShapeType
 */
export const StepShapeType: ShapeType<Step> = {
  schema: tutorialSchema,
  shape: "http://example.org/Step",
  context: tutorialContext,
};
