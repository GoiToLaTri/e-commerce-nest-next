export interface IUserProfile {
  userId: string;
  preferredFeatures: Map<string, number>;
  totalInteractionScore: number;
}
