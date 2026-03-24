namespace Menu;

public interface IMenuGenerationService
{
    Task<WeeklyMenuDto> GenerateAsync(CancellationToken cancellationToken);
}