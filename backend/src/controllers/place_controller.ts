import { Place, IPlaceDocument } from './../models/place';
import * as restify from 'restify';
import { formatResponse, getUserFromReq } from '../utils/api_helper';


/**
 *
 * @api {get} /place Get places
 * @apiName get_place
 * @apiGroup place
 * @apiVersion  1.0.0
 * @apiHeader (AuthHeader) {String} Content-Type application/json
 * @apiParam (Query) {Number} lat The latitude of the center point
 * @apiParam (Query) {Number} lng The longitude of the center point
 * @apiParam (Query) {Number} r   The radius (in meters) to query
 * @apiSuccessExample {type} Success-Response:
 * {
 *     success: true,
 * }
 */
export async function list(req: restify.Request, res: restify.Response, next: restify.Next): Promise<void> {
  const {
    lat,
    lng,
    r,
  } = req.query;

  const query: any = {
    location: {
      $nearSphere: {
        $geometry: {
          type: 'Point',
          coordinates: [lng, lat],
        },
        $maxDistance: r * 1000,
      },
    },
  };

  const places: IPlaceDocument[] = await Place.find(query, null, { limit: 100 });

  // TODO: pagination

  res.send(formatResponse({
    places,
  }));
  return next();
}

/**
 *
 * @api {post} /place Create a new place
 * @apiName new_place
 * @apiGroup place
 * @apiVersion  1.0.0
 * @apiHeader (AuthHeader) {String} Content-Type application/json
 * @apiParamExample {json} Request Example:
                   {
                      name: {
                        zh_hk: String,
                        en_us: String,
                      },
                      description: {
                        zh_hk: String,
                        en_us: String,
                      },
                      location: {
                        lat: Number.
                        lng: Number,
                      },
                      year_from: Number,  // optional, default: 0
                      year_to: Number,    // optional, default: 2999
                      provider: String,   // ['manual', 'had']
                      provider_id: String
                   }
 * @apiSuccessExample {type} Success-Response:
 * {
 *     success: true,
 * }
 */
export async function create(req: restify.Request, res: restify.Response, next: restify.Next): Promise<void> {
  const { name, description, location, address, provider, provider_id, year_from, year_to } = req.body;

  const place = new Place({
    name,
    provider,
    provider_id,
    location: {
      type: 'Point',
      // Note that longitude comes first in a GeoJSON coordinate array, not latitude.
      coordinates: [location.lng, location.lat],
    },
  });

  if (address) {
    place.address = address;
  }
  if (description) {
    place.description = description;
  }
  if (year_from) {
    place.year_from = year_from;
  }
  if (year_to) {
    place.year_to = year_to;
  }

  // Let the async middleware handle the error
  await place.save();
  res.send(formatResponse({
    place,
  }));
  return next();
}

export async function update(req: Request, res: Response, next: Function): Promise<void> {

}