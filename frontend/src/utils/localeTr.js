export const categoryLabels = {
  Electronics: "Elektronik",
  Clothing: "Giyim",
  Shoes: "Ayakkabi",
  Home: "Ev",
  Accessories: "Aksesuar",
};

export const trackingStatusLabels = {
  created: "Olusturuldu",
  processing: "Hazirlaniyor",
  shipped: "Kargoya verildi",
  in_transit: "Transferde",
  delivered: "Teslim edildi",
  returned: "Iade edildi",
};

export const paymentStatusLabels = {
  pending: "Beklemede",
  paid: "Odendi",
  failed: "Basarisiz",
  refunded: "Iade edildi",
};

export const paymentMethodLabels = {
  "Cash on delivery": "Kapida odeme",
  "Credit card": "Kredi karti",
  "Bank transfer": "Havale / EFT",
};

export function trCategory(value) {
  return categoryLabels[value] || value;
}

export function trTrackingStatus(value) {
  return trackingStatusLabels[value] || value;
}

export function trPaymentStatus(value) {
  return paymentStatusLabels[value] || value;
}

export function trPaymentMethod(value) {
  return paymentMethodLabels[value] || value;
}
