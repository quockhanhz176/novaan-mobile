
type IngredientsReducerAction =
    | {
          type: "add" | "remove";
          value: string;
      }
    | {
          type: "reset";
      };

const ingredientsReducer = (
    ingredients: Set<string>,
    action: IngredientsReducerAction
): Set<string> => {
    switch (action.type) {
        case "add":
            if (ingredients.has(action.value)) {
                return ingredients;
            }
            ingredients.add(action.value);
            return new Set(ingredients);
        case "remove":
            if (!ingredients.has(action.value)) {
                return ingredients;
            }
            ingredients.delete(action.value);
            return new Set(ingredients);
        case "reset":
            return new Set();
    }
};

export default ingredientsReducer;