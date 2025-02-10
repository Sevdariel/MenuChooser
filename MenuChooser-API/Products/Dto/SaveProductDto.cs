namespace Products.Dto
{
    public class CreateProductDto
    {
        public required string Name { get; set; }
        public required string Producent { get; set; }
        public required string CreatedBy { get; set; }
    }
}