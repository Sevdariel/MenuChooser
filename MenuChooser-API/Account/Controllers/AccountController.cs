﻿using Account.Dto;
using Account.Services;
using Email.Entities;
using Email.Interface;
using Microsoft.AspNetCore.Mvc;
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
        public async Task<ActionResult<UserDto>> Register(UserRegisterDto registerDto)
        {
            if (AccountExists(registerDto.Email))
                return BadRequest("Account exists");

            if (UsernameTaken(registerDto.Username))
                return BadRequest("Username already taken");

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

        [HttpPost("forgot-password")]
        public async Task<ActionResult<ResetPasswordDto>> ForgotPassword(ForgotPasswordDto forgotPasswordDto)
        {
            var user = await _userService.GetUserByEmailAsync(forgotPasswordDto.Email);

            if (user == null)
                return BadRequest("Invalid request");

            var token = _tokenService.CreatePasswordResetTokenAsync(user);
            var resetLink = $"{forgotPasswordDto.ClientURI}?token={token}";

            var message = new Message([user.Email], "Reset password token", $"<a href=\"{resetLink}\">To reset your password, click here!</a>");


            await _emailSender.SendEmailAsync(message);
            return new ResetPasswordDto
            {
                IsReset = true,
            };
        }

        private bool AccountExists(string email) => _accountService.AccountExist(email);

        private bool UsernameTaken(string username) => _accountService.UsernameTaken(username);
    }
}
