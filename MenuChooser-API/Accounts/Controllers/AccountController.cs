using MenuChooser.Accounts.Dto;
using MenuChooser.Accounts.Services;
using MenuChooser.Dto;
using MenuChooser.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;

namespace MenuChooser.Accounts.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly AccountService _accountService;
        private readonly ITokenService _tokenService;

        public AccountController(
            AccountService accountService,
            ITokenService tokenService)
        {
            _accountService = accountService;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (UserExists(registerDto.Username))
                return BadRequest("Username is already taken");

            using var hmac = new HMACSHA512();

            var user = new User
            {
                Username = registerDto.Username,
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
                PasswordSalt = hmac.Key,
            };

            await _accountService.RegisterUser(user);

            return new UserDto
            {
                Username = registerDto.Username,
                Token = _tokenService.CreateToken(user)
            };
        }


        private bool UserExists(string username) => _accountService.IsUserExists(username);
    }
}
