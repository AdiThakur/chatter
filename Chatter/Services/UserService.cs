using Chatter.Data.Entities;
using Chatter.Data.Repos;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Chatter.Services
{
    public interface IUserService
    {
        Task<User?> GetUserAsync(long userId);
        Task<List<User>> GetUsersAsync();
        Task<string> LoginAsync(string username, string password);
        Task<User?> RegisterAsync(string username, string password);
    }

    public class UserService : IUserService
    {
        private readonly IConfiguration _config;
        private readonly IUsersRepo _usersRepo;

        public UserService(
            IConfiguration config,
            IUsersRepo usersRepo
        )
        {
            _config = config;
            _usersRepo = usersRepo;
        }

        public async Task<User?> RegisterAsync(string username, string password)
        {
            if ((await _usersRepo.GetUserAsync(username)) != null)
            {
                throw new UserException(
                    "Invalid Username",
                    "Please choose a different username"
                );
            }

            // Todo: Hash password before storing in DB
            var userToAdd = new User
            {
                Username = username,
                Password = password
            };

            return await _usersRepo.AddUserAsync(userToAdd);
        }

        public async Task<string> LoginAsync(string username, string password)
        {
            var user = await _usersRepo.GetUserAsync(username);
            if (user == null)
            {
                throw new UserException(
                     "Invalid Username",
                     "This user does not exist"
                 );
            }

            if (password != user.Password)
            {
                // TODO: Should ideally return a less specific message
                throw new UserException(
                     "Invalid Password",
                     "Password does not match"
                 );
            }

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Username)
            };

            return GenerateJwt(claims);
        }

        public async Task<List<User>> GetUsersAsync()
        {
            return await _usersRepo.GetUsersAsync();
        }

        public async Task<User?> GetUserAsync(long userId)
        {
            return await _usersRepo.GetUserAsync(userId);
        }

        private string GenerateJwt(List<Claim> claims)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var signingCredentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                _config["Jwt:Issuer"],
                _config["Jwt:Audience"],
                claims,
                expires: DateTime.Now.AddMinutes(15),
                signingCredentials: signingCredentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
