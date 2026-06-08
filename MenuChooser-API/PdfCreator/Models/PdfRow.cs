namespace PdfCreator.Models;

public record PdfRow(
    string Label,
    string Value,
    int? Calories = null,
    int? Duration = null,
    string? Description = null,
    List<string>? Ingredients = null
);