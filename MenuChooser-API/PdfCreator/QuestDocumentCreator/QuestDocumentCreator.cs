using PdfCreator.Models;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace PdfCreator.QuestDocumentCreator;

public class QuestDocumentCreator(PdfDocument pdfDocument) : IDocument
{
    public DocumentMetadata GetMetadata() => DocumentMetadata.Default;

    public void Compose(IDocumentContainer container)
    {
        container.Page(page =>
        {
            page.Size(PageSizes.A4);
            page.Margin(40);
            page.DefaultTextStyle(x => x.FontFamily("Arial").FontSize(10));

            page.Header().Element(ComposeHeader);
            page.Content().Element(ComposeContent);
            page.Footer().AlignCenter().Text(x =>
            {
                x.Span("Wygenerowano: ");
                x.Span(DateTime.Now.ToString("dd.MM.yyyy"));
            });
        });
    }

    private void ComposeHeader(IContainer container)
    {
        container.Column(col =>
        {
            col.Item().Text(pdfDocument.Title)
                .FontSize(22).FontColor("#2D6A4F").Bold();

            if (pdfDocument.SubTitle is not null)
                col.Item().Text(pdfDocument.SubTitle)
                    .FontSize(11).FontColor("#555555");

            col.Item().PaddingTop(8).LineHorizontal(1).LineColor("#2D6A4F");
        });
    }

    private void ComposeContent(IContainer container)
    {
        container.PaddingTop(16).Column(col =>
        {
            foreach (var section in pdfDocument.Sections)
                col.Item().PaddingBottom(12).Element(c => ComposeSection(c, section));
        });
    }

    private void ComposeSection(IContainer container, PdfSection section)
    {
        container
            .Border(1).BorderColor("#E0E0E0")
            .CornerRadius(6)
            .Padding(10)
            .Column(col =>
            {
                col.Item()
                    .Background("#2D6A4F")
                    .Padding(6)
                    .Text(section.Header)
                    .FontColor("#FFFFFF").Bold().FontSize(11);

                col.Item().PaddingTop(6).Column(mealCol =>
                {
                    var isOdd = true;
                    foreach (var row in section.Rows)
                    {
                        var bg = isOdd ? "#F0FAF4" : "#FFFFFF";
                        mealCol.Item().Background(bg).Border(1).BorderColor("#E0E0E0").CornerRadius(4).Padding(8).Column(rowCol =>
                        {
                            // Meal type and recipe name
                            rowCol.Item().Row(recipeRow =>
                            {
                                recipeRow.ConstantColumn(90).Element(c =>
                                    c.Text(row.Label).Bold().FontColor("#2D6A4F").FontSize(10));
                                recipeRow.RelativeColumn().Element(c =>
                                    c.Text(row.Value).FontColor("#333333").FontSize(10));
                            });

                            // Recipe details row
                            rowCol.Item().PaddingTop(4).Row(detailsRow =>
                            {
                                detailsRow.RelativeColumn().Element(c =>
                                {
                                    c.Column(detailCol =>
                                    {
                                        // Duration
                                        if (row.Duration.HasValue)
                                        {
                                            detailCol.Item().Text($"⏱ {row.Duration} min")
                                                .FontSize(9).FontColor("#666666");
                                        }

                                        // Calories
                                        if (row.Calories.HasValue)
                                        {
                                            detailCol.Item().Text($"🔥 {row.Calories} kcal")
                                                .FontSize(9).FontColor("#666666");
                                        }
                                    });
                                });
                            });

                            // Description
                            if (!string.IsNullOrEmpty(row.Description))
                            {
                                rowCol.Item().PaddingTop(4).Text(row.Description)
                                    .FontSize(9).FontColor("#555555").Italic();
                            }

                            // Ingredients
                            if (row.Ingredients != null && row.Ingredients.Count > 0)
                            {
                                rowCol.Item().PaddingTop(4).Text("Składniki:")
                                    .FontSize(9).FontColor("#2D6A4F").Bold();
                                rowCol.Item().Text(string.Join(", ", row.Ingredients))
                                    .FontSize(9).FontColor("#555555");
                            }
                        });
                        mealCol.Item().PaddingBottom(4);
                        isOdd = !isOdd;
                    }
                });
            });
    }
}
