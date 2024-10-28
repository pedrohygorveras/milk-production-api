/**
 * farmer_id
 * name
 * location
 * lat
 * lng
 * distance_to_factory_km
 * createdAt
 * updatedAt
 */

class Farm {
  constructor() {
    this.collectionName = "farms";
  }
}

export const farmModel = new Farm();
