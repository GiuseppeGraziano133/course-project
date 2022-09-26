import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { DataStorageService } from '../shared/data-storage.service';
import { Recipe } from './recipes.model';
import { RecipesService } from './recipes.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit, OnDestroy {
  currentRecipe: Recipe;
  showDetails: boolean = false;
  private recipeSelectedSub: Subscription;
  user: User = null;

  constructor(private recipesService: RecipesService, private authService: AuthService, private router: Router, private dataStorage: DataStorageService) { }

  ngOnInit(): void {
    this.authService.user.subscribe(user => {
      this.user = user;
      if (!this.user) {
        this.router.navigate(['/auth']);
      }
      
      if (this.recipesService.getRecipes().length === 0) {
        this.onFetchData();
      }

      this.updateRecipes();
    });
  }

  updateRecipes() {
    if (this.user) {
      this.recipeSelectedSub = this.recipesService.recipeSelected.subscribe((r: Recipe) => {
        this.currentRecipe = r;
        this.showDetails = true;
      });
    }
  }

  onFetchData() {
    this.recipesService.deleteRecipes();
    this.dataStorage.fetchData().subscribe((recipes: Recipe[]) => {
      this.recipesService.addRecipes(recipes);
    });
  }

  ngOnDestroy(): void {
    if (this.user) {
      //this.recipeSelectedSub.unsubscribe();
    }
  }
}
