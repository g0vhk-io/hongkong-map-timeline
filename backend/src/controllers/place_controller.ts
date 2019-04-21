import { Place, IPlaceDocument, IPlace } from './../models/place';
import { PlaceLinkage, IPlaceLinkageDocument } from './../models/place_linkage';
import * as restify from 'restify';
import { formatResponse, getUserFromReq } from '../utils/api_helper';
import logger from '../utils/logger';
import * as uuid from 'uuid/v4';
/**
 *
 * @api {get} /place Get places
 * @apiName list_place
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
    lat = 22.2983061,
    lng = 114.1600453,
    r = 1000,
    limit = 1000,
    year_from = 0,
    year_to = 2999,
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
    year_from: {
      $gte: year_from,
    },
    year_to: {
      $lte: year_to,
    },
  };

  let places: IPlaceDocument[] = [];
  try {
    places = await Place.find(
      query,
      {
        location: 1,
        id: 1,
        name: 1,
        year_from: 1,
        year_to: 1,
      },
      {
        limit: limit > 1000 ? 1000 : limit,
      });
  } catch (error) {
    logger.error(error.message);
    logger.error(error.stack);
  }

  // TODO: pagination

  res.send(formatResponse({
    places,
  }));
  return next();
}

/**
 *
 * @api {get} /place/:id Get place
 * @apiName get_place
 * @apiGroup place
 * @apiVersion  1.0.0
 * @apiHeader (AuthHeader) {String} Content-Type application/json
 * @apiSuccessExample {type} Success-Response:
 * {
 *     success: true,
 * }
 */
export async function get(req: restify.Request, res: restify.Response, next: restify.Next): Promise<void> {
  const {
    id,
  } = req.params;

  let place: IPlaceDocument;
  try {
    place = await Place.findOne({ _id: id });
  } catch (error) {
    logger.error(error.message);
    logger.error(error.stack);
  }

  // TODO: pagination

  res.send(formatResponse(place));
  return next();
}


/**
 *
 * @api {get} /place/:id/linkage Get linkage of a place
 * @apiName get_place_linkage
 * @apiGroup place
 * @apiVersion  1.0.0
 * @apiHeader (AuthHeader) {String} Content-Type application/json
 * @apiParam (Param) {String} id page id
 *
 * @apiSuccess (200) {Object[]} data all linkages of the place
 * @apiSuccess (200) {String} data.id id of the place linkage
 * @apiSuccess (200) {Object[]} data.linkages linkages of the place linkage
 * @apiSuccess (200) {Object[]} data.linkages.parents parents of a the place linkage
 * @apiSuccess (200) {Localizable} data.linkages.parents.name name of the place
 * @apiSuccess (200) {Number} data.linkages.parents.year_from year_from
 * @apiSuccess (200) {Number} data.linkages.parents.year_to year_to
 * @apiSuccess (200) {String} data.linkages.parents.id id
 * @apiSuccess (200) {Object[]} data.linkages.children children of a single linkage
 * @apiSuccess (200) {Localizable} data.linkages.children.name name of the place
 * @apiSuccess (200) {Number} data.linkages.children.year_from year_from
 * @apiSuccess (200) {Number} data.linkages.children.year_to year_to
 * @apiSuccess (200) {String} data.linkages.children.id id
 * @apiSuccess (200) {String} data.linkages.type type of the linkage
 * @apiSuccessExample {type} Success-Response:
 * {
 *     success: true,
 * }
 */
export async function getLinkage(req: restify.Request, res: restify.Response, next: restify.Next): Promise<void> {
  const {
    id,
  } = req.params;

  const placeLinkages: IPlaceLinkageDocument[] = await PlaceLinkage.find({
    $or: [
      { 'linkages.parents': id },
      { 'linkages.children': id },
    ],
  })
  .populate('linkages.children', ['name', 'year_from', 'year_to'])
  .populate('linkages.parents', ['name', 'year_from', 'year_to']);
  res.send(formatResponse(placeLinkages));
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

  const place: IPlaceDocument = new Place({
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

  if (provider && provider === 'manual') {
    place.provider_id = uuid();
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
