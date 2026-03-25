using PdfCreator.Models;

namespace PdfCreator.Services;

public interface IPdfCreatorService
{
    byte[] Generate(PdfDocument document);
}