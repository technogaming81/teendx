/* eslint-disable */
/**
 * Generated data model types.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import { AnyDataModel } from "convex/server";
import type { GenericId } from "convex/values";

/**
 * No `schema.ts` file found!
 *
 * This file will be populated with your table definitions if you add a schema.
 */
export type DataModel = AnyDataModel;

export type Id<TableName extends keyof DataModel> =
  GenericId<TableName>;
