import { IRecipe } from '../../../../recipe/models/recipe.model';

export class GetRecipe {
  static readonly type = '[Recipe Form] Get Recipe';
  constructor(public readonly id: string) {}
}

export class GetRecipeSuccess {
  static readonly type = '[Recipe Form] Get Recipe Success';
  constructor(public readonly recipe: IRecipe) {}
}

export class GetRecipeError {
  static readonly type = '[Recipe Form] Get Recipe Error';
  constructor(public readonly error: string) {}
}

export class SaveRecipe {
  static readonly type = '[Recipe Form] Save Recipe';
  constructor(public readonly recipe: IRecipe) {}
}

export class SaveRecipeSuccess {
  static readonly type = '[Recipe Form] Save Recipe Success';
  constructor(public readonly recipe: IRecipe) {}
}

export class SaveRecipeError {
  static readonly type = '[Recipe Form] Save Recipe Error';
  constructor(public readonly error: string) {}
}

export class UpdateRecipe {
  static readonly type = '[Recipe Form] Update Recipe';
  constructor(public readonly recipe: IRecipe) {}
}

export class UpdateRecipeSuccess {
  static readonly type = '[Recipe Form] Update Recipe Success';
  constructor(public readonly recipe: IRecipe) {}
}

export class UpdateRecipeError {
  static readonly type = '[Recipe Form] Update Recipe Error';
  constructor(public readonly error: string) {}
}

export class DeleteRecipe {
  static readonly type = '[Recipe Form] Delete Recipe';
  constructor(public readonly id: string) {}
}

export class DeleteRecipeSuccess {
  static readonly type = '[Recipe Form] Delete Recipe Success';
  constructor(public readonly id: string) {}
}

export class DeleteRecipeError {
  static readonly type = '[Recipe Form] Delete Recipe Error';
  constructor(public readonly error: string) {}
}

export class ClearRecipeForm {
  static readonly type = '[Recipe Form] Clear Recipe Form';
}
