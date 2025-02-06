using Microsoft.AspNetCore.Mvc;
using Users.Entities;
using Users.Service;

namespace Users.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;

        public UserController(UserService userService) => _userService = userService;

        [HttpGet]
        public async Task<List<User>> Get() => await _userService.GetUsersAsync();

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> Get(string email)
        {
            var user = await _userService.GetUserByEmailAsync(email);

            if (user is null)
                return NotFound();

            return user;
        }

        [HttpPost]
        public async Task<IActionResult> Post(User newUser)
        {
            await _userService.CreateUserAsync(newUser);

            return CreatedAtAction(nameof(Get), new { id = newUser.Email }, newUser);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(User updatedUser)
        {
            var user = await _userService.GetUserByEmailAsync(updatedUser.Email);

            if (user is null)
                return NotFound();

            await _userService.UpdateUserAsync(updatedUser);

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string email)
        {
            var user = await _userService.GetUserByEmailAsync(email);

            if (user is null)
            {
                return NotFound();
            }

            await _userService.RemoveUserAsync(email);

            return NoContent();
        }
    }
}
