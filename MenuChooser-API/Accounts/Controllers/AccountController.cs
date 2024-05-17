using MenuChooser.Accounts.Dto;
using MenuChooser.Accounts.Services;
using MenuChooser.Dto;
using MenuChooser.Entities;
using MenuChooser.Repository;
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
        private readonly UserService _userService;
        private readonly ITokenService _tokenService;

        public AccountController(
            AccountService accountService,
            UserService userService,
            ITokenService tokenService)
        {
            _accountService = accountService;
            _userService = userService;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(UserRegisterDto registerDto)
        {
            if (UserExists(registerDto.Email))
                return BadRequest("Username is already taken");

            using var hmac = new HMACSHA512();

            var user = new User
            {
                Email = registerDto.Email,
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
                PasswordSalt = hmac.Key,
            };

            await _accountService.RegisterUser(user);

            return new UserDto
            {
                Email = registerDto.Email,
                Token = _tokenService.CreateToken(user)
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(UserLoginDto loginDto)
        {
            var user = await _userService.GetUserByEmailAsync(loginDto.Email);

            if (user == null)
                return Unauthorized("Invalid email");

            using var hmac = new HMACSHA512(user.PasswordSalt);

            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

            if (!computedHash.SequenceEqual(user.PasswordHash))
                return Unauthorized("Invalid password");

            return new UserDto
            {
                Email = user.Email,
                Token = _tokenService.CreateToken(user),
            };
        }

        private bool UserExists(string username) => _accountService.IsUserExists(username);
    }
}
