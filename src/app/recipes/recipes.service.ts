import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";
import { Recipe } from "./recipes.model";

@Injectable({providedIn: 'root'})

export class RecipesService {
    private recipes: Recipe[] = [];

    recipeSelected = new Subject<Recipe>();
    recipeDeleted = new Subject<Recipe>();
    recipeAdded = new Subject<Recipe[]>();

    constructor() {
        this.setIds();
    }

    setIds() {
        for (let i = 0; i < this.recipes.length; i++) {
            this.recipes[i].id = i;
        }
    }

    getRecipes() {
        return this.recipes.slice();
    }
    
    getRecipe(id: number) {
        return this.recipes[id];
    }

    deleteRecipe(recipe: Recipe) {
        this.recipes = this.recipes.filter(x => x !== recipe);
        this.recipeDeleted.next(recipe);
        this.setIds();
    }

    deleteRecipes() {
        this.recipes = [];
        this.setIds();
    }

    addRecipe(recipe: Recipe) {
        this.recipes.push(recipe);
        this.recipeAdded.next(this.recipes);
        this.setIds();
    }

    addRecipes(recipes: Recipe[]) {
        this.recipes.push(...recipes);
        this.recipeAdded.next(this.recipes);
        this.setIds();
    }

    updateRecipe(oldRecipe: Recipe, recipe: Recipe) {
        const i = this.recipes.map(x => x.name).indexOf(oldRecipe.name);
        
        this.recipes[i].name = recipe.name;
        this.recipes[i].description = recipe.description;
        this.recipes[i].imagePath = recipe.imagePath;
        this.recipes[i].ingredients = recipe.ingredients;
    }
}