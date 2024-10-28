/**
 * farm_id
 * year
 * month
 * price_per_liter
 * total_volume_liters
 * total_payment
 * createdAt
 * updatedAt
 */

class Payment {
  constructor() {
    this.collectionName = "payments";
  }
}

export const paymentModel = new Payment();
