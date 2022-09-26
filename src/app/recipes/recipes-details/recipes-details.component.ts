import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { ShoppingListService } from 'src/app/shopping-list/shopping-list.service';
import { Recipe } from '../recipes.model';
import { RecipesService } from '../recipes.service';

@Component({
  selector: 'app-recipes-details',
  templateUrl: './recipes-details.component.html',
  styleUrls: ['./recipes-details.component.css']
})
export class RecipesDetailsComponent implements OnInit {
  @Input() recipe: Recipe;

  constructor(private recipesService: RecipesService, private shoppingListService: ShoppingListService, private route: ActivatedRoute, private router: Router, private dataStorage: DataStorageService) { }

  ngOnInit(): void {
    this.dataStorage.fetchData().subscribe(() => {
      this.route.params.subscribe((params: Params) => {
        this.recipe = this.recipesService.getRecipe(params['id']);
      });
    });
  }

  addToShoppingList() {
    this.shoppingListService.addIngredients(this.recipe.ingredients);
  }

  gotoEdit() {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  deleteRecipe(recipe: Recipe) {
    this.recipesService.deleteRecipe(recipe);
    this.recipe = this.recipesService.getRecipe(this.route.snapshot.params['id']);
  }
}
