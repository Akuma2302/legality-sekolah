/**
 * Applied to every schema so API responses use `id` (not `_id`/`__v`),
 * matching what the frontend already expects.
 */
export function toCleanJSON(schema, { hide = [] } = {}) {
  schema.set('toJSON', {
    virtuals: true,
    transform: (_doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      for (const field of hide) delete ret[field];
      return ret;
    },
  });
}
