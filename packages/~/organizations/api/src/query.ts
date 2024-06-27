//

import { Entity_Schema, Pagination_Schema } from "@~/app.core/schema";
import { z } from "zod";

export const SearchParams_Schema = z.object({
  q: z.string().default(""),
});
export type SearchParams = z.infer<typeof SearchParams_Schema>;

export default Pagination_Schema.merge(Entity_Schema.partial()).merge(
  SearchParams_Schema,
);
