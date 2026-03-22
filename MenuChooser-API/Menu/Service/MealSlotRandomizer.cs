using Recipes.Entities;

namespace Menu;

public interface IMealSlotRandomizer
{
    IReadOnlyList<Recipe> PickDistinct(IReadOnlyList<Recipe> source, int count);
}

public class RandomMealSlotRandomizer : IMealSlotRandomizer
{
    public IReadOnlyList<Recipe> PickDistinct(IReadOnlyList<Recipe> source, int count)
        => source.OrderBy(_ => Random.Shared.Next()).Take(count).ToList();
}