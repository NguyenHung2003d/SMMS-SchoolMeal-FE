import { RecaptchaVerifier, ConfirmationResult } from "firebase/auth";

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier | null;
    confirmationResult: ConfirmationResult;
    cachedDailyMeals?: DailyMeal[];
    cachedMenuItems?: MenuFoodItem[];
  }
}
