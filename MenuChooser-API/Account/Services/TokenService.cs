using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Users.Entities;

namespace Account.Services
{
    public class TokenService : ITokenService
    {
        private readonly SymmetricSecurityKey _key;
        private readonly ILogger<TokenService> _logger;

        public TokenService(IConfiguration configuration, ILogger<TokenService> logger)
        {
            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["TokenKey"]!));
            _logger = logger;
        }

        public string CreateToken(User user)
        {
            try
            {
                _logger.LogInformation("Creating JWT token for user: {Username}", user.Username);
                
                var claims = new List<Claim> {
                    new Claim(JwtRegisteredClaimNames.Email, user.Email),
                    new Claim(JwtRegisteredClaimNames.PreferredUsername, user.Username),
                 };

                var credentials = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(claims),
                    Expires = DateTime.UtcNow.AddDays(7),
                    SigningCredentials = credentials,
                };

                var tokenHandler = new JwtSecurityTokenHandler();

                var token = tokenHandler.CreateToken(tokenDescriptor);
                var tokenString = tokenHandler.WriteToken(token);
                
                _logger.LogInformation("JWT token created successfully for user: {Username}", user.Username);
                return tokenString;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating JWT token for user: {Username}", user.Username);
                throw;
            }
        }

        public string CreatePasswordResetTokenAsync(User user)
        {
            try
            {
                _logger.LogInformation("Creating password reset token for user: {Username}", user.Username);
                
                var claims = new List<Claim>
                {
                    new Claim(JwtRegisteredClaimNames.NameId, user.Username),
                    new Claim(JwtRegisteredClaimNames.Email, user.Email),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim("TokenType", "PasswordReset")
                };

                var credentials = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(claims),
                    // ToDo: Change to lower value ie. 15 minutes
                    Expires = DateTime.UtcNow.AddDays(1),
                    SigningCredentials = credentials,
                };

                var tokenHandler = new JwtSecurityTokenHandler();

                var token = tokenHandler.CreateToken(tokenDescriptor);
                var tokenString = tokenHandler.WriteToken(token);
                
                _logger.LogInformation("Password reset token created successfully for user: {Username}", user.Username);
                return tokenString;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating password reset token for user: {Username}", user.Username);
                throw;
            }
        }

        public bool ValidatePasswordResetToken(string token)
        {
            _logger.LogDebug("Validating password reset token");
            
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = _key,
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };

                tokenHandler.ValidateToken(token, validationParameters, out SecurityToken validatedToken);
                _logger.LogInformation("Password reset token validated successfully");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Password reset token validation failed");
                return false;
            }
        }
    }
}

