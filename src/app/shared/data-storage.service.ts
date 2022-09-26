import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Recipe } from '../recipes/recipes.model';

@Injectable({providedIn: 'root'})

export class DataStorageService {
    url = 'https://ng-course-5a96b-default-rtdb.europe-west1.firebasedatabase.app/';

    constructor (private http: HttpClient, private auth: AuthService) {}

    saveData(recipes: Recipe[]) {
        this.clearData().subscribe(() => {
            this.http.post<{[key: string]: Recipe[]}>(this.url + 'recipes.json', recipes, {
                params: new HttpParams().set('auth', this.auth.getToken())
            }).subscribe();
        });
    }

    fetchData() {
        return this.http.get<{[key: string]: Recipe[]}>(this.url + 'recipes.json', {
            params: new HttpParams().set('auth', this.auth.getToken())
        }).pipe(map(response => {
            const recipesArray: Recipe[] = [];
            for (let key in response) {
                recipesArray.push(...response[key]);
            }
            return recipesArray;
        }));
    }

    clearData() {
        return this.http.delete(this.url + 'recipes.json');
    }
}