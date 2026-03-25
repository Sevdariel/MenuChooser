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

                col.Item().PaddingTop(6).Table(table =>
                {
                    table.ColumnsDefinition(c =>
                    {
                        c.ConstantColumn(90);
                        c.RelativeColumn();
                    });

                    var isOdd = true;
                    foreach (var row in section.Rows)
                    {
                        var bg = isOdd ? "#F0FAF4" : "#FFFFFF";
                        table.Cell().Background(bg).Padding(4)
                            .Text(row.Label).Bold().FontColor("#2D6A4F");
                        table.Cell().Background(bg).Padding(4)
                            .Text(row.Value).FontColor("#333333");
                        isOdd = !isOdd;
                    }
                });
            });
    }
}
