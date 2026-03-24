namespace PdfCreator.Models;

public record PdfDocument(
    string Title,
    string? SubTitle,
    IReadOnlyList<PdfSection> Sections
);