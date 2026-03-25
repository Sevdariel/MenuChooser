namespace Menu;

public interface IMenuGenerationService
{
    Task<byte[]> GenerateAsync(CancellationToken cancellationToken);
}