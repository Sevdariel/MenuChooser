using Account.Dto;
using Account.Services;
using Email.Entities;
using Email.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
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
        IAccountService accountService,
        IUserService userService,
        ITokenService tokenService,
        IEmailSender emailSender,
        ILogger<AccountController> logger) : ControllerBase
    {
        private readonly IAccountService _accountService = accountService;
        private readonly IUserService _userService = userService;
        private readonly ITokenService _tokenService = tokenService;
        private readonly IEmailSender _emailSender = emailSender;
        private readonly ILogger<AccountController> _logger = logger;

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<ActionResult<TokenDto>> Register(UserRegisterDto registerDto)
        {
            _logger.LogInformation("Register attempt for email: {Email}", registerDto.Email);
            
            if (AccountExists(registerDto.Email))
            {
                _logger.LogWarning("Registration failed: Account with email {Email} already exists", registerDto.Email);
                return BadRequest("Account with provided email exists");
            }

            if (UsernameTaken(registerDto.Username))
            {
                _logger.LogWarning("Registration failed: Username {Username} already taken", registerDto.Username);
                return BadRequest("Username already taken");
            }

            using var hmac = new HMACSHA512();

            var user = new User
            {
                Email = registerDto.Email,
                Username = registerDto.Username,
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
                PasswordSalt = hmac.Key,
            };

            await _accountService.RegisterUser(user);
            _logger.LogInformation("User registered successfully: {Username}", user.Username);

            return new TokenDto
            {
                Token = _tokenService.CreateToken(user)
            };
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<TokenDto>> Login(UserLoginDto loginDto)
        {
            _logger.LogInformation("Login attempt for email: {Email}", loginDto.Email);
            
            var user = await _userService.GetUserByEmailAsync(loginDto.Email);

            if (user == null)
            {
                _logger.LogWarning("Login failed: User not found for email {Email}", loginDto.Email);
                return Unauthorized("Invalid login data");
            }

            using var hmac = new HMACSHA512(user.PasswordSalt);

            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

            if (!computedHash.SequenceEqual(user.PasswordHash))
            {
                _logger.LogWarning("Login failed: Invalid password for email {Email}", loginDto.Email);
                return Unauthorized("Invalid login data");
            }

            _logger.LogInformation("Login successful for user: {Username}", user.Username);
            return new TokenDto
            {
                Token = _tokenService.CreateToken(user),
            };
        }

        [HttpPost("forgot-password")]
        [AllowAnonymous]
        public async Task<ActionResult<ResetPasswordSendDto>> ForgotPassword(ForgotPasswordDto forgotPasswordDto)
        {
            _logger.LogInformation("Password reset request for email: {Email}", forgotPasswordDto.Email);
            
            var user = await _userService.GetUserByEmailAsync(forgotPasswordDto.Email);

            if (user == null)
            {
                _logger.LogWarning("Password reset failed: User not found for email {Email}", forgotPasswordDto.Email);
                return BadRequest("User with provided email doesn't exists");
            }

            var token = _tokenService.CreatePasswordResetTokenAsync(user);
            var resetLink = $"{forgotPasswordDto.ClientURI}/account/reset-password?token={token}";

            var message = new Message([user.Email], "Reset password token", $"<a href=\"{resetLink}\">To reset your password, click here!</a>");

            await _emailSender.SendEmailAsync(message);
            _logger.LogInformation("Password reset email sent to: {Email}", user.Email);

            return new ResetPasswordSendDto
            {
                IsReset = true,
            };
        }

        [HttpPost("reset-password")]
        [AllowAnonymous]
        public async Task<IActionResult> ResetPassword(ResetPasswordDto resetPasswordDto)
        {
            _logger.LogInformation("Password reset attempt for email: {Email}", resetPasswordDto.Email);
            
            var user = await _userService.GetUserByEmailAsync(resetPasswordDto.Email);
            if (user == null)
            {
                _logger.LogWarning("Password reset failed: User not found for email {Email}", resetPasswordDto.Email);
                return BadRequest("Invalid request");
            }

            if (!_tokenService.ValidatePasswordResetToken(resetPasswordDto.Token))
            {
                _logger.LogWarning("Password reset failed: Invalid or expired token for email {Email}", resetPasswordDto.Email);
                return BadRequest("Invalid or expired token");
            }

            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var jwtToken = tokenHandler.ReadJwtToken(resetPasswordDto.Token);
                var emailClaim = jwtToken.Claims.FirstOrDefault(claim => claim.Type == JwtRegisteredClaimNames.Email)?.Value;
                var tokenTypeClaim = jwtToken.Claims.FirstOrDefault(claim => claim.Type == "TokenType")?.Value;

                if (emailClaim != resetPasswordDto.Email || tokenTypeClaim != "PasswordReset")
                {
                    _logger.LogWarning("Password reset failed: Token mismatch for email {Email}", resetPasswordDto.Email);
                    return BadRequest("Invalid token");
                }

                using var hmac = new HMACSHA512(user.PasswordSalt);

                var newPasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(resetPasswordDto.Password));

                if (_accountService.IsPasswordUnchanged(user.PasswordHash, newPasswordHash))
                {
                    _logger.LogWarning("Password reset failed: Password unchanged for email {Email}", resetPasswordDto.Email);
                    return BadRequest("Password unchanged");
                }

                user.PasswordHash = newPasswordHash;
                user.PasswordSalt = hmac.Key;

                await _userService.UpdateUserAsync(user);
                _logger.LogInformation("Password reset successful for user: {Username}", user.Username);

                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Password reset failed with exception for email {Email}", resetPasswordDto.Email);
                return BadRequest("Invalid token");
            }
        }

        private bool AccountExists(string email) => _accountService.AccountExist(email);

        private bool UsernameTaken(string username) => _accountService.UsernameTaken(username);
    }
}
