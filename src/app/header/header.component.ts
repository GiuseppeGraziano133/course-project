import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { Recipe } from '../recipes/recipes.model';
import { RecipesService } from '../recipes/recipes.service';
import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() toggle = new EventEmitter<string>();
  user: User;

  constructor(private dataStorage: DataStorageService, private recipesService: RecipesService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    if (this.user) {
      this.onFetchData();
    }

    this.authService.user.subscribe(user => {
      this.user = user;
    })
  }

  goTo(page: string) {
    this.toggle.emit(page);
  }

  onSaveData() {
    this.dataStorage.saveData(this.recipesService.getRecipes());
  }

  onFetchData() {
    this.recipesService.deleteRecipes();
    this.dataStorage.fetchData().subscribe((recipes: Recipe[]) => {
      this.recipesService.addRecipes(recipes);
    });
  }

  onLogout() {
    this.user = null;
    this.authService.logout();
  }
}
