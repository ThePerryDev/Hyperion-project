/* Arquivo para escrever os models do STAC API */
import mongoose from 'mongoose';
import { StacItem } from 'stac-ts';

const Stac_APISchema = new mongoose.Schema<StacItem>({
  stac_version: { type: String, required: true },
  type: { type: String, required: true },
  id: { type: String, required: true, unique: true },
  bbox: [Number],
  geometry: { type: Object, required: true },
  properties: {
    datetime: { type: String, required: true }
  },
  stac_collection: String,
  links: [Object],
  assets: Object
}, { suppressReservedKeysWarning: true });

export default mongoose.model<StacItem>('Stac_API', Stac_APISchema);