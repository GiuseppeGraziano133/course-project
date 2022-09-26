import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { Recipe } from '../recipes.model';
import { RecipesService } from '../recipes.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode: boolean = false;
  form: FormGroup;
  recipe: Recipe;
  imageUrl: string;

  constructor(private route: ActivatedRoute, private recipesService: RecipesService, private router: Router) { }

  ngOnInit(): void {
    this.recipe = new Recipe(0, '', '', '', []);

    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = (params['id'] !== null && params['id'] !== undefined);
      this.initForm();
    });
  }

  private initForm() {
    let recipeName = this.editMode ? this.recipesService.getRecipe(this.id).name : '';
    let recipeUrl = this.editMode ? this.recipesService.getRecipe(this.id).imagePath : '';
    let recipeDescription = this.editMode ? this.recipesService.getRecipe(this.id).description : '';
    let recipeIngredients =  new FormArray([]);

    if (this.editMode) {
      if (this.recipesService.getRecipe(this.id).ingredients) {
        for (let ing of this.recipesService.getRecipe(this.id).ingredients) {
          recipeIngredients.push(new FormGroup({
            'name': new FormControl(ing.name, Validators.required),
            'amount': new FormControl(ing.amount, [
              Validators.required,
              Validators.pattern(/^[1-9]+[0-9]*$/)
            ])
          }));
        }
      }
    }
    
    this.form = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'url': new FormControl(recipeUrl, Validators.required),
      'description': new FormControl(recipeDescription, Validators.required),
      'ingredients': recipeIngredients
    });

    this.recipe.name = this.form.get('name').value;
    this.recipe.description = this.form.get('description').value;
    this.recipe.imagePath = this.form.get('url').value;

    this.recipe.ingredients = [];

    for (let ing of this.getControls()) {
      this.recipe.ingredients.push(ing.value);
    }
  }

  getControls() {
    return (<FormArray>this.form.get('ingredients')).controls;
  }

  getIngredientsFormArray(): FormArray {
    return this.form.get('ingredients') as FormArray;
  }

  onSubmit() {
    let buffer: Ingredient[] = [];

    for (let ing of this.getControls()) {
      buffer.push(ing.value);
    }

    if (this.editMode) {
      this.recipesService.updateRecipe(this.recipe, new Recipe(
        0,
        this.form.get('name').value,
        this.form.get('description').value,
        this.form.get('url').value,
        buffer,
      ));
    } else {
      this.recipesService.addRecipe(new Recipe(
        0,
        this.form.get('name').value,
        this.form.get('description').value,
        this.form.get('url').value,
        buffer,
      ));
    }

    this.recipe.name = this.form.get('name').value;
    this.recipe.description = this.form.get('description').value;
    this.recipe.imagePath = this.form.get('url').value;

    this.recipe.ingredients = [];

    for (let ing of this.getControls()) {
      this.recipe.ingredients.push(ing.value);
    }

    this.router.navigate([`../`], {relativeTo: this.route});
  }

  onCancel() {
    this.router.navigate([`../`], {relativeTo: this.route});
  }

  onDeleteIngredient(i: number) {
    this.getIngredientsFormArray().removeAt(i);
    this.recipe.ingredients = [];

    for (let ing of this.getControls()) {
      this.recipe.ingredients.push(ing.value);
    }
  }

  onAddIngredient() {
    this.getIngredientsFormArray().push(new FormGroup({
      'name': new FormControl(null, Validators.required),
      'amount': new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[1-9]+[0-9]*$/)
      ])
    }));

    this.recipe.ingredients = [];

    for (let ing of this.getControls()) {
      this.recipe.ingredients.push(ing.value);
    }
  }
}
