export interface IngredientDto {
  ingredientId: number;
  ingredientName: string;
  ingredientType?: string;
  energyKcal?: number;
  proteinG?: number;
  fatG?: number;
  carbG?: number;
  schoolId?: string;
  isActive?: boolean;
}

export enum AllergyRiskStatus {
  Green = 0,
  Orange = 1,
  Red = 2,
}

export interface FoodItemIngredientDto {
  ingredientId: number;
  ingredientName?: string;
  quantityGram: number;
}

export interface FoodItemDto {
  foodId: number;
  foodName: string;
  foodType?: string;
  foodDesc?: string;
  imageUrl?: string;
  isMainDish: boolean;
  ingredients: FoodItemIngredientDto[];
  allergyStatus: AllergyRiskStatus;
  totalAllergyPercent: number;
}

export interface CreateIngredientRequest {
  ingredientName: string;
  ingredientType: string;
  energyKcal: number;
  proteinG: number;
  fatG: number;
  carbG: number;
}
