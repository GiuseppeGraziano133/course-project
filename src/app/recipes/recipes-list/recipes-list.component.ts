import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { Recipe } from '../recipes.model';
import { RecipesService } from '../recipes.service';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.css']
})
export class RecipesListComponent implements OnInit, OnDestroy {
  recipes: Recipe[] = [];

  constructor(private recipesService: RecipesService, private dataStorage: DataStorageService) { }

  ngOnInit(): void {
    this.dataStorage.fetchData().subscribe(recipes => {
      this.recipes = recipes;
    })

    this.recipesService.recipeDeleted.subscribe((recipe: Recipe) => {
      this.recipes = this.recipesService.getRecipes();
    });
    
    this.recipesService.recipeAdded.subscribe((recipes) => {
      this.recipes = recipes;
    });
  }

  ngOnDestroy(): void {
    this.recipesService.recipeAdded.unsubscribe();
  }
}
