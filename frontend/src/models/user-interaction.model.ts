export interface AddUserInteractionPayload {
  userId: string;
  productId: string;
  action: "VIEW" | "PURCHASE" | "LIKE" | "ADDTOCART";
}
