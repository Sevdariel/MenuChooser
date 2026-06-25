using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Users.Entities;
using Users.Service;

namespace Users.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ILogger<UserController> _logger;

        public UserController(IUserService userService, ILogger<UserController> logger)
        {
            _userService = userService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<List<User>> Get()
        {
            _logger.LogInformation("Fetching all users");
            var users = await _userService.GetUsersAsync();
            _logger.LogInformation("Retrieved {UserCount} users", users.Count);
            return users;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> Get(string email)
        {
            _logger.LogDebug("Fetching user by email: {Email}", email);
            var user = await _userService.GetUserByEmailAsync(email);

            if (user is null)
            {
                _logger.LogWarning("User not found with email: {Email}", email);
                return NotFound();
            }

            return user;
        }

        [HttpPost]
        public async Task<IActionResult> Post(User newUser)
        {
            _logger.LogInformation("Creating user: {Username}", newUser.Username);
            await _userService.CreateUserAsync(newUser);
            _logger.LogInformation("User created successfully: {Email}", newUser.Email);

            return CreatedAtAction(nameof(Get), new { id = newUser.Email }, newUser);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(User updatedUser)
        {
            _logger.LogInformation("Updating user: {Email}", updatedUser.Email);
            var user = await _userService.GetUserByEmailAsync(updatedUser.Email);

            if (user is null)
            {
                _logger.LogWarning("User not found for update: {Email}", updatedUser.Email);
                return NotFound();
            }

            await _userService.UpdateUserAsync(updatedUser);
            _logger.LogInformation("User updated successfully: {Email}", updatedUser.Email);

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string email)
        {
            _logger.LogInformation("Deleting user: {Email}", email);
            var user = await _userService.GetUserByEmailAsync(email);

            if (user is null)
            {
                _logger.LogWarning("User not found for deletion: {Email}", email);
                return NotFound();
            }

            await _userService.RemoveUserAsync(email);
            _logger.LogInformation("User deleted successfully: {Email}", email);

            return NoContent();
        }
    }
}
