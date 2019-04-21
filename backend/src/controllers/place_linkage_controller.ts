import { Place, IPlaceDocument } from './../models/place';
import { PlaceLinkage, IPlaceLinkageDocument, IPlaceLinkage } from './../models/place_linkage';
import { formatResponse, getUserFromReq } from '../utils/api_helper';
import * as restify from 'restify';

/**
 *
 * @api {POST} /place/linkage Create Place Linkage
 * @apiName create_place_linkage
 * @apiGroup place_linkage
 * @apiParam  (Body) {Object[]} linkages Linkages
 * @apiParam  (Body) {String='reconstruction'} linkages.type Type of linkage
 * @apiParam  (Body) {String[]} linkages.parents uuid of the parents
 * @apiParam  (Body) {String[]} linkages.children uuid of the children
 *
 * @apiSuccess (200) {Boolean} ok
 * @apiSuccess (200) {Boolean} id place_linkage id
 *
 *
 */
export async function createLinkage(req: restify.Request, res: restify.Response, next: restify.Next): Promise<void> {
  const { linkages }: {
    linkages: any[],
  } = req.body;

  console.log(linkages);

  const placeLinkage: IPlaceLinkageDocument = new PlaceLinkage({
    linkages,
  });
  await placeLinkage.save();

  res.send(formatResponse({
    id: placeLinkage.id,
  }));
}

export async function get(req: restify.Request, res: restify.Response, next: restify.Next): Promise<void> {
  const {
    id,
  }: {
    id: string,
  } = req.params;

  const placeLinkage: IPlaceLinkageDocument = await PlaceLinkage.findById(id);

  res.send(formatResponse({
    linkage: placeLinkage,
  }));
}

export async function addParentLinkage(req, res, next) {

}

export async function addChildLinkage(req, res, next) {

}

export async function updateLinkage(req, res, next) {

}

export async function removeParentLinkage(req, res, next) {

}

export async function removeChildLinkage(req, res, next) {

}

export async function deleteLinkage(req, res, next) {

}
