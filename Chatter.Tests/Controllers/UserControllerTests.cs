using AutoFixture;
using AutoFixture.AutoMoq;
using Chatter.Controllers;
using Chatter.Data.Models;
using Chatter.Data.Repos;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Threading.Tasks;
using Xunit;

namespace Chatter.Tests.Controllers
{
    public class UserControllerTests
    {
        private readonly IFixture _fixture;

        private readonly Mock<IUsersRepo> _mockUsersRepo;

        private readonly UserController _sut;

        public UserControllerTests()
        {
            _fixture = new Fixture().Customize(new AutoMoqCustomization());
            _fixture.OmitAutoProperties = true;

            _mockUsersRepo = _fixture.Freeze<Mock<IUsersRepo>>();

            _sut = _fixture.Create<UserController>();
        }

        [Theory]
        [InlineData(null)]
        [InlineData("")]
        public async Task AddUserAsync_InvalidDisplayName_ReturnsBadRequest(string? displayName)
        {
            var userToAdd = new User { DisplayName = displayName };

            var actionResult = await _sut.AddUserAync(userToAdd);

            Assert.IsType<BadRequestObjectResult>(actionResult.Result);
        }

        [Fact]
        public async Task AddUserAsync_ExistingDisplayName_ReturnsBadRequest()
        {
            // Arrange
            var displayName = "DisplayName";
            var userToAdd = new User { DisplayName = displayName };

            _mockUsersRepo
                .Setup(repo => repo.GetUserAsync(displayName))
                .ReturnsAsync(new User { DisplayName = displayName });
            
            // Act
            var actionResult = await _sut.AddUserAync(userToAdd);

            // Assert
            Assert.IsType<BadRequestObjectResult>(actionResult.Result);
        }

        [Fact]
        public async Task AddUserAsync_NewDisplayName_ResetsId()
        {
            // Arrange
            var userToAdd = new User
            {
                Id = 10,
                DisplayName = "DisplayName"
            };

            _mockUsersRepo
                .Setup(repo => repo.GetUserAsync(It.IsAny<string>()))
                .ReturnsAsync((User?)null);

            // Act
            var actionResult = await _sut.AddUserAync(userToAdd);

            // Assert
            _mockUsersRepo
                .Verify(repo => repo.AddUserAsync(It.Is<User>(u => u.Id == 0)));
            Assert.IsType<OkObjectResult>(actionResult.Result);
        }
    }
}
