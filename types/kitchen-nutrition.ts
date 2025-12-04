export interface IngredientDto {
  ingredientId: number;
  ingredientName: string;
  ingredientType?: string;
  energyKcal?: number;
  proteinG?: number;
  fatG?: number;
  carbG?: number;
  unit?: string;
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
}

export interface CreateIngredientRequest {
  ingredientName: string;
  ingredientType: string;
  energyKcal: number;
  proteinG: number;
  fatG: number;
  carbG: number;
}
