type IngredientsReducerAction =
    | {
          type: "add" | "remove";
          value: string;
      }
    | {
          type: "reset";
      };

const ingredientsReducer = (
    ingredients: Set<string> | undefined,
    action: IngredientsReducerAction
): Set<string> | undefined => {
    switch (action.type) {
        case "add":
            if (ingredients == null) {
                ingredients = new Set();
            }
            if (ingredients.has(action.value)) {
                return ingredients;
            }
            ingredients.add(action.value);
            return new Set(ingredients);
        case "remove":
            if (ingredients == null || !ingredients.has(action.value)) {
                return ingredients;
            }
            ingredients.delete(action.value);
            return new Set(ingredients);
        case "reset":
            return undefined;
    }
};

export default ingredientsReducer;
