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
        public async Task RegisterAsync_InvalidUserName_ReturnsBadRequest(string? userName)
        {
            var credentials = new LoginModel { UserName = userName, Password = "Password" };

            var actionResult = await _sut.RegisterAsync(credentials);

            Assert.IsType<BadRequestObjectResult>(actionResult.Result);
        }

        [Fact]
        public async Task RegisterAsync_ExistingUserName_ReturnsBadRequest()
        {
            // Arrange
            var userName = "Username";
            var credentials = new LoginModel { UserName = userName, Password = "Password" };

            _mockUsersRepo
                .Setup(repo => repo.GetUserAsync(userName))
                .ReturnsAsync(new User { UserName = userName });
            
            // Act
            var actionResult = await _sut.RegisterAsync(credentials);

            // Assert
            Assert.IsType<BadRequestObjectResult>(actionResult.Result);
        }
    }
}
