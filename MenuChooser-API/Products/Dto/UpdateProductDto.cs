namespace Products.Dto
{
    public class UpdateProductDto
    {
        public required string Id { get; set; }
        public required string Name { get; set; }
        public required string Producent { get; set; }
    }
}