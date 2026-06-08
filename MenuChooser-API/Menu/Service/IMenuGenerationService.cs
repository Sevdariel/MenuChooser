using Menu.Dto;
using Menu.Entities;

namespace Menu;

public interface IMenuGenerationService
{
    Task<byte[]> GenerateAsync(MenuGenerateRequest menuGenerateRequest, CancellationToken cancellationToken);
    Task<MenuPreviewDto> PreviewAsync(MenuGenerateRequest menuGenerateRequest, CancellationToken cancellationToken);
}