using Products.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Recipe.Entities
{
    public class Step
    {
        public string Content { get; set; } = null!;
        public List<Product> Products { get; set; } = null!;
        public int Duration { get; set; }

    }
}
