import { Document, Schema, Model, model } from 'mongoose';
import { jsonTransform } from './../utils/model_helper';
import { Localizable, ILocalizable } from './localizable';
import { TagSchema, ITagDocument } from './tag';
import { PLACE_PROVIDER, PLACE_METADATA_KEYS } from './../common/common';
import { PlaceLinkageSchema } from './place_linkage';

export const PlaceSchema = new Schema(
  {
    name: Localizable({ index: true }),
    description: Localizable({}),
    address: Localizable({}),
    year_from: {
      type: Number,
      default: 0,
    },
    year_to: {
      type: Number,
      default: 2999,
    },
    // GeoJSON
    location: { type: { type: String, default: 'Point' }, coordinates: [Number] },
    tags: [TagSchema],
    provider: {
      type: String,
      enum: PLACE_PROVIDER,
    },
    provider_id: String,
    metadata: [{
      key: {
        type: String,
        enum: PLACE_METADATA_KEYS,
      },
      value: String,
    }],
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: {
      transform: jsonTransform([], (ret) => {
        if (ret.location) {
          ret.location = {
            lat: ret.location.coordinates[1],
            lng: ret.location.coordinates[0],
          };
        }
      }),
    },
  });

PlaceSchema.index({ location: '2dsphere' });
PlaceSchema.index({ provider: 1, provider_id: 1, year_from: 1, year_to: 1 }, { unique: true });

/**
* Public interface for place model
*/
export interface IPlace {
  name?: ILocalizable;
  address?: ILocalizable;
  description?: ILocalizable;
  year_from: Number;
  year_to: Number;
  provider: string;
  provider_id?: string;
  tags: [ITagDocument];
}

export interface IPlaceDocument extends IPlace, Document {
}

export const Place: Model<IPlaceDocument> = model<IPlaceDocument>('Place', PlaceSchema);
