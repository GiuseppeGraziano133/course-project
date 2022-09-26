import { Subject } from "rxjs";
import { Injectable } from "@angular/core";
import { Ingredient } from "../shared/ingredient.model";

@Injectable({providedIn: 'root'})

export class ShoppingListService {
    ingredientsChanged = new Subject<Ingredient[]>();
    selectedChanged = new Subject<Ingredient>();

    private ingredients: Ingredient[] = [];

    ingredientSelected: Ingredient;

    getIngredients() {
        return this.ingredients.slice();
    }

    addIngredient(ing: Ingredient) {
        const names = this.ingredients.map(x => x.name);
    
        if (names.includes(ing.name)) {
            const i = names.indexOf(ing.name);
            this.ingredients[i].amount += ing.amount;
        } else {
            this.ingredients.push(ing);
        }

        this.ingredientsChanged.next(this.ingredients.slice());
    }

    addIngredients(ings: Ingredient[]) {
        const names = this.ingredients.map(x => x.name);
    
        for (let ing of ings) {
            if (names.includes(ing.name)) {
                const i = names.indexOf(ing.name);
                this.ingredients[i].amount += ing.amount;
            } else {
                this.ingredients.push(ing);
            }
        }

        this.ingredientsChanged.next(this.ingredients.slice());
    }
    
    deleteIngredient(ing: Ingredient) {
        const names = this.ingredients.map(x => x.name);
    
        if (names.includes(ing.name)) {
            const i = names.indexOf(ing.name);
            this.ingredients[i].amount -= ing.amount;
        
            if (this.ingredients[i].amount <= 0) {
                this.ingredients.splice(i, 1);
            }
        }

        this.ingredientsChanged.next(this.ingredients.slice())
    }

    eraseIngredient(ing: Ingredient) {
        const names = this.ingredients.map(x => x.name);
        const i = names.indexOf(ing.name);
        this.ingredients.splice(i, 1);
        this.ingredientsChanged.next(this.ingredients.slice())
    }
    
    select(ing: Ingredient) {
        this.ingredientSelected = ing;
        this.selectedChanged.next(this.ingredientSelected);
    }
}