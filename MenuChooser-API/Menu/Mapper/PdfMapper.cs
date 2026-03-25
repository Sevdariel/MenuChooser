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
            Rows:
            [
                new PdfRow("Śniadanie", day.Breakfast.Name),
                new PdfRow("Obiad", day.Lunch.Name),
                new PdfRow("Kolacja", day.Dinner.Name),
                new PdfRow("Podwiecz.", day.Supper.Name)
            ]
        )).ToList()
    );
}