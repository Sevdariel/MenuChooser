using System.Text.Json.Serialization;

namespace Recipes.Entities
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum MealType
    {
        Breakfast,
        Dinner,
        Lunch,
        Appetizer,
        Dessert,
    }
}
