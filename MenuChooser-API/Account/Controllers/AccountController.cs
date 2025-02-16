using Account.Dto;
using Account.Services;
using Email.Entities;
using Email.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Cryptography;
using System.Text;
using Users.Dto;
using Users.Entities;
using Users.Service;

namespace Account.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController(
        AccountService accountService,
        UserService userService,
        ITokenService tokenService,
        IEmailSender emailSender) : ControllerBase
    {
        private readonly AccountService _accountService = accountService;
        private readonly UserService _userService = userService;
        private readonly ITokenService _tokenService = tokenService;
        private readonly IEmailSender _emailSender = emailSender;

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<ActionResult<TokenDto>> Register(UserRegisterDto registerDto)
        {
            if (AccountExists(registerDto.Email))
                return BadRequest("Account with provided email exists");

            if (UsernameTaken(registerDto.Username))
                return BadRequest("Username already taken");

            using var hmac = new HMACSHA512();

            var user = new User
            {
                Email = registerDto.Email,
                Username = registerDto.Username,
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
                PasswordSalt = hmac.Key,
            };

            await _accountService.RegisterUser(user);

            return new TokenDto
            {
                Token = _tokenService.CreateToken(user)
            };
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<TokenDto>> Login(UserLoginDto loginDto)
        {
            var user = await _userService.GetUserByEmailAsync(loginDto.Email);

            if (user == null)
                return Unauthorized("Invalid login data");

            using var hmac = new HMACSHA512(user.PasswordSalt);

            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

            if (!computedHash.SequenceEqual(user.PasswordHash))
                return Unauthorized("Invalid login data");

            return new TokenDto
            {
                Token = _tokenService.CreateToken(user),
            };
        }

        [HttpPost("forgot-password")]
        [AllowAnonymous]
        public async Task<ActionResult<ResetPasswordSendDto>> ForgotPassword(ForgotPasswordDto forgotPasswordDto)
        {
            var user = await _userService.GetUserByEmailAsync(forgotPasswordDto.Email);

            if (user == null)
                return BadRequest("User with provided email doesn't exists");

            var token = _tokenService.CreatePasswordResetTokenAsync(user);
            var resetLink = $"{forgotPasswordDto.ClientURI}/account/reset-password?token={token}";

            var message = new Message([user.Email], "Reset password token", $"<a href=\"{resetLink}\">To reset your password, click here!</a>");

            await _emailSender.SendEmailAsync(message);

            return new ResetPasswordSendDto
            {
                IsReset = true,
            };
        }

        [HttpPost("reset-password")]
        [AllowAnonymous]
        public async Task<IActionResult> ResetPassword(ResetPasswordDto resetPasswordDto)
        {
            var user = await _userService.GetUserByEmailAsync(resetPasswordDto.Email);
            if (user == null)
                return BadRequest("Invalid request");

            if (!_tokenService.ValidatePasswordResetToken(resetPasswordDto.Token))
                return BadRequest("Invalid or expired token");

            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var jwtToken = tokenHandler.ReadJwtToken(resetPasswordDto.Token);
                var emailClaim = jwtToken.Claims.FirstOrDefault(claim => claim.Type == JwtRegisteredClaimNames.Email)?.Value;
                var tokenTypeClaim = jwtToken.Claims.FirstOrDefault(claim => claim.Type == "TokenType")?.Value;

                if (emailClaim != resetPasswordDto.Email || tokenTypeClaim != "PasswordReset")
                    return BadRequest("Invalid token");

                using var hmac = new HMACSHA512(user.PasswordSalt);

                var newPasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(resetPasswordDto.Password));

                if (_accountService.IsPasswordUnchanged(user.PasswordHash, newPasswordHash))
                    return BadRequest("Password unchanged");

                user.PasswordHash = newPasswordHash;
                user.PasswordSalt = hmac.Key;

                await _userService.UpdateUserAsync(user);

                return Ok();
            }
            catch
            {
                return BadRequest("Invalid token");
            }
        }

        private bool AccountExists(string email) => _accountService.AccountExist(email);

        private bool UsernameTaken(string username) => _accountService.UsernameTaken(username);
    }
}
