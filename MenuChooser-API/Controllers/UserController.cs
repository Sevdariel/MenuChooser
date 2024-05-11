using MenuChooser.Entities;
using MenuChooser.Repository;
using Microsoft.AspNetCore.Mvc;

namespace MenuChooser.Controllers
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
        public async Task<ActionResult<User>> Get(string id)
        {
            var user = await _userService.GetUserByEmailAsync(id);

            if (user is null)
                return NotFound();

            return user;
        }

        [HttpPost]
        public async Task<IActionResult> Post(User newUser)
        {
            await _userService.CreateUserAsync(newUser);

            return CreatedAtAction(nameof(Get), new {id = newUser.Email}, newUser);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, User updatedUser)
        {
            var user = await _userService.GetUserByEmailAsync(id);

            if (user is null)
                return NotFound();

            updatedUser.Email = user.Email;

            await _userService.UpdateUserAsync(id, updatedUser);

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var user = await _userService.GetUserByEmailAsync(id);

            if (user is null)
            {
                return NotFound();
            }

            await _userService.RemoveUserAsync(id);

            return NoContent();
        }
    }
}
