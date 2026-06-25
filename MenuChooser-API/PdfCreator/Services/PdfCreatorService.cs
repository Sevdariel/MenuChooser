using Microsoft.Extensions.Logging;
using PdfCreator.Models;
using QuestPDF.Fluent;
using QuestPDF.Infrastructure;

namespace PdfCreator.Services;

public class PdfCreatorService : IPdfCreatorService
{
    private readonly ILogger<PdfCreatorService> _logger;

    public PdfCreatorService(ILogger<PdfCreatorService> logger)
    {
        _logger = logger;
    }

    public byte[] Generate(PdfDocument document)
    {
        _logger.LogInformation("Starting PDF generation");
        QuestPDF.Settings.License = LicenseType.Community;
        var pdf = new QuestDocumentCreator.QuestDocumentCreator(document).GeneratePdf();
        _logger.LogInformation("PDF generated successfully, size: {Size} bytes", pdf.Length);
        return pdf;
    }
}