using System.Globalization;
using Menu.Entities;
using PdfCreator.Models;

namespace Menu.Mapper;

public static class MenuPdfMapper
{
    public static PdfDocument ToPdfDocument(WeeklyMenu menu) => new(
        Title: "Menu tygodniowe",
        SubTitle: $"Tydzień od {menu.WeekStart:dd.MM.yyyy}",
        Sections: menu.Days.Select(day => new PdfSection(
            Header: day.Date.ToString("dddd, dd.MM.yyyy", new CultureInfo("pl-PL")),
            Rows: day.Meals.Select(meal => new PdfRow(meal.Name, meal.Recipe.Name)).ToList()
        )).ToList()
    );
}