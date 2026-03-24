using PdfCreator.Models;
using QuestPDF.Fluent;
using QuestPDF.Infrastructure;

namespace PdfCreator.Services;

public class PdfCreatorService : IPdfCreatorService
{
    public byte[] Generate(PdfDocument document)
    {
        QuestPDF.Settings.License = LicenseType.Community;
        return new QuestDocumentCreator.QuestDocumentCreator(document).GeneratePdf();
    }
}