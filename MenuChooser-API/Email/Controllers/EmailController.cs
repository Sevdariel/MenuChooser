using Email.Dto;
using Microsoft.AspNetCore.Mvc;
using Users.Service;

namespace Email.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmailController: ControllerBase
    {
        private readonly UserService _userService;
        public EmailController(UserService userService) => _userService = userService;

        [HttpPost]
        public async Task<IActionResult> PasswordResetMail(ResetPasswordDto resetPasswordDto)
        {
            return Ok();
        }
    }
}
