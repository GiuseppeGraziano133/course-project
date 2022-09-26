import { Component, OnInit, ViewChild, Input, SimpleChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-list-edit',
  templateUrl: './shopping-list-edit.component.html',
  styleUrls: ['./shopping-list-edit.component.css']
})
export class ShoppingListEditComponent implements OnInit {
  @ViewChild('f', {static: true}) form: NgForm;
  @Input() selectedIngredient: Ingredient;
  nameBind: string;
  amountBind: number;

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit(): void {
    this.shoppingListService.selectedChanged.subscribe((ing: Ingredient) => {
      console.log('Raggiunto edit');
      this.selectedIngredient = ing;

      if (this.selectedIngredient !== null && this.selectedIngredient !== undefined) {
        this.nameBind = this.selectedIngredient.name;
        this.amountBind = this.selectedIngredient.amount;
      }
    });
  }

  onAddIngredient() {
    const name = this.form.value.name.charAt(0).toUpperCase() + this.form.value.name.split('').splice(1).join('').toLowerCase();
    const amount = this.form.value.amount;

    if (name !== '' && name !== undefined && amount > 0 && !this.checkNumber(amount)) {
      const ing = new Ingredient(name, amount);
      this.shoppingListService.addIngredient(ing);
    }
  }

  onDeleteIngredient() {
    const name = this.form.value.name.charAt(0).toUpperCase() + this.form.value.name.split('').splice(1).join('').toLowerCase();
    const amount = parseInt(this.form.value.amount);

    if (name !== '' && name !== undefined && amount > 0 && !this.checkNumber(amount)) {
      const ing = new Ingredient(name, amount);
      this.shoppingListService.deleteIngredient(ing);
    }
  }

  onUpdate() {
    const name = this.form.value.name.charAt(0).toUpperCase() + this.form.value.name.split('').splice(1).join('').toLowerCase();
    const amount = this.form.value.amount;

    if (name !== '' && name !== undefined && amount > 0 && !this.checkNumber(amount) && this.checkName(name)) {
      const ing = new Ingredient(name, amount);
      this.shoppingListService.eraseIngredient(ing);
      this.shoppingListService.addIngredient(ing);
    }
  }

  clearFields() {
    this.nameBind = '';
    this.amountBind = null;
  }

  checkNumber(n: any) {
    return isNaN(n);
  }

  checkName(s: string) {
    return this.shoppingListService.getIngredients().map(x => x.name).includes(s);
  }
}
