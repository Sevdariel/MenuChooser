using Email.Dto;
using Email.Interface;
using Email.Service;
using Microsoft.AspNetCore.Mvc;
using Users.Service;

namespace Email.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmailController: ControllerBase
    {
        private readonly UserService _userService;
        private readonly IEmailSender _emailSender;

        public EmailController(UserService userService,
            IEmailSender emailSender) 
        {
            _userService = userService;
            _emailSender = emailSender;
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> PasswordResetMail(ResetPasswordDto resetPasswordDto)
        {
            var user = await _userService.GetUserByEmailAsync(resetPasswordDto.Email);

            if (user == null)
            {
                return NotFound();
            }

            await _emailSender.SendEmailAsync(user);

            return Ok();
        }
    }
}
