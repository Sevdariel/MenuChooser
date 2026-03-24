using Menu.Service;
using Microsoft.AspNetCore.Mvc;
using Products.Service;

namespace Menu.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MenuController
    {
        private readonly MenuGenerationService _menuGenerationService;
        [HttpPost]
        public async Task<ActionResult<bool>> CreateMenu(CancellationToken cancellationToken)
        {
            
            
            var menu = _menuGenerationService.GenerateAsync(cancellationToken);
        }
    }    
}

