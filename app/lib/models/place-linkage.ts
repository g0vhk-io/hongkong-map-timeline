import IPlace from './place';

export enum IPlaceLinkageType {
  Reconstruction = 'reconstruction',
}

export interface IPlaceLinkageNode {
  children: IPlaceLinkageNode[];
  place: IPlace;
  type: IPlaceLinkageType;
  parentCount: number;
}

export function generateLinkageTree(data: any, id: string): IPlaceLinkageNode[] {

  const nodeMap: {
    [id: string]: IPlaceLinkageNode
  } = {};


  // Construct the tree by the data from server
  for (const record of data) {
    for (const linkage of record.linkages) {
      const { parents, children, type } = linkage;
      for (const parent of parents) {
        const parentNode: IPlaceLinkageNode = nodeMap[parent.id] !== undefined
          ? nodeMap[parent.id]
          : {
            place: parent,
            children: [],
            type,
            parentCount: 0,
          };
        nodeMap[parent.id] = parentNode;

        for (const child of children) {
          const childNode: IPlaceLinkageNode = nodeMap[child.id] !== undefined
            ? nodeMap[child.id]
            : {
              place: child,
              children: [],
              type,
              parentCount: 0,
            };

          childNode.parentCount += 1;
          parentNode.children.push(childNode);
          nodeMap[child.id] = childNode;

        }

      }
    }
  }

  const rootNodes = [];

  for (const node of Object.values(nodeMap)) {
    if (node.parentCount === 0) {
      if (lookup(id, node)) {
        rootNodes.push(node);
      }
    }
  }

  return rootNodes;

  function lookup(placeId: string, rootNode: IPlaceLinkageNode): boolean {
    if (!rootNode) {
      return false;
    } else if (rootNode.place.id === placeId) {
      return true;
    }

    for (const node of rootNode.children) {
      if (lookup(placeId, node)) {
        return true;
      }
    }
  }

}

