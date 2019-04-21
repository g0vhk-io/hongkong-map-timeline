import { Document, Schema, Model, model } from 'mongoose';
import { jsonTransform } from './../utils/model_helper';
import { IPlaceDocument } from './place';
import { PLACE_LINKAGE_TYPE } from './../common/common';
export const PlaceLinkageSchema = new Schema(
  {
    linkages: [{
      type: {
        type: String,
        enum: PLACE_LINKAGE_TYPE,
      },
      // Use objectId to prevent circular reference
      parents: [{ type: Schema.Types.ObjectId, ref: 'Place' }],
      children: [{ type: Schema.Types.ObjectId, ref: 'Place' }],
    }],
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: {
      transform: jsonTransform([], (ret) => {
        ret.linkages.forEach(linkage => delete linkage._id);
      }),
    },
  });
PlaceLinkageSchema.index({ 'linkage.type': 1, 'linkage.parents': 1 });
PlaceLinkageSchema.index({ 'linkage.type': 1, 'linkage.children': 1 });

export interface ILinkage {
  type: string;
  parents: IPlaceDocument[];
  children: IPlaceDocument[];
}

/**
* Public interface for place model
*/
export interface IPlaceLinkage {
  linkages: ILinkage[];
}

export interface IPlaceLinkageDocument extends IPlaceLinkage, Document {
}

export const PlaceLinkage: Model<IPlaceLinkageDocument> = model<IPlaceLinkageDocument>('PlaceLinkage', PlaceLinkageSchema);
