export interface CheckoutPayload {
  delivery: "shipping" | "pickup";
  fullname: string;
  address: [string, string];
  phone: {
    countrycode: string;
    number: string;
  };
  paymentMethod: "momo" | "cash" | "creditcard" | string;
}
