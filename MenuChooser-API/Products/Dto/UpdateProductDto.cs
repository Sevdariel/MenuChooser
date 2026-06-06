using Products.Entities;

namespace Products.Dto
{
    public class UpdateProductDto
    {
        public required string Id { get; set; }
        public required string Name { get; set; }
        public required string Producent { get; set; }
        public string? Sub { get; set; }
        public string? Emoji { get; set; }
        public ProductCategory? Category { get; set; }
        public string? Unit { get; set; }
        public int? Kcal { get; set; }
        public double? Protein { get; set; }
        public double? Carbs { get; set; }
        public double? Fat { get; set; }
        public required string CreatedBy { get; set; }
        public required string UpdatedBy { get; set; }
    }
}