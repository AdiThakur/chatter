using AutoFixture;
using AutoFixture.AutoMoq;
using Chatter.Data.Entities;
using Chatter.Data.Repos;
using Chatter.Services;
using Moq;
using System.Threading.Tasks;
using Xunit;

namespace Chatter.Tests.Controllers
{
    public class UserServiceTests
    {
        private readonly IFixture _fixture;

        private readonly Mock<IUsersRepo> _mockUsersRepo;

        private readonly UserService _sut;

        public UserServiceTests()
        {
            _fixture = new Fixture().Customize(new AutoMoqCustomization());

            _mockUsersRepo = _fixture.Freeze<Mock<IUsersRepo>>();

            _sut = _fixture.Create<UserService>();
        }

        [Fact]
        public async Task RegisterAsync_UsernameExists_ThrowsUserException()
        {
            // Arrange
            var username = "username";
            var password = "password";

            _mockUsersRepo
                .Setup(repo => repo.GetUserAsync(username))
                .ReturnsAsync(new User { Username = username });
            
            // Act
            var uex = await Assert.ThrowsAsync<UserException>(
                () => _sut.RegisterAsync(username, password)
            );

            // Assert
            Assert.Equal("Invalid Username", uex.Title);
        }

        [Fact]
        public async Task LoginAsync_InvalidUsername_ThrowsUserException()
        {
            // Arrange
            var username = "username";
            var password = "password";

            _mockUsersRepo
                .Setup(repo => repo.GetUserAsync(username))
                .ReturnsAsync((User?)null);

            // Act
            var uex = await Assert.ThrowsAsync<UserException>(
                () => _sut.LoginAsync(username, password)
            );

            // Assert
            Assert.Equal("Invalid Credentials", uex.Title);
        }

        [Fact]
        public async Task LoginAsync_IncorrectPassword_ThrowsUserException()
        {
            // Arrange
            var username = "username";
            var password = "password";

            _mockUsersRepo
                .Setup(repo => repo.GetUserAsync(username))
                .ReturnsAsync(
                    new User
                    {
                        Username = username,
                        Password = "different_password"
                    }
                );

            // Act
            var uex = await Assert.ThrowsAsync<UserException>(
                () => _sut.LoginAsync(username, password)
            );

            // Assert
            Assert.Equal("Invalid Credentials", uex.Title);
        }
    }
}
