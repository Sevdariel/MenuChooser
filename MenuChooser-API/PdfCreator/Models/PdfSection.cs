namespace PdfCreator.Models;

public record PdfSection(
    string Header,
    IReadOnlyList<PdfRow> Rows
);