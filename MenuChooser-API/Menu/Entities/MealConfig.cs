using Recipes.Entities;

namespace Menu.Entities;

public class MealConfig
{
    public MealType Type { get; set; }
    public string Name { get; set; }
    public string Time { get; set; }
    public bool Enabled { get; set; }
}