using Chatter.Controllers;
using Chatter.Data.Entities;
using Chatter.Data.Repos;
using Moq;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Xunit;
using AutoFixture;
using AutoFixture.AutoMoq;
using System.Collections.Generic;

namespace Chatter.Tests.Controllers
{
    public class ChatRoomControllerTests
    {
        private readonly IFixture _fixture;

        private readonly Mock<IChatRoomsRepo> _mockChatRoomsRepo;
        private readonly Mock<IUsersRepo> _mockUsersRepo;

        private readonly ChatRoomController _sut;

        public ChatRoomControllerTests()
        {
            _fixture = new Fixture().Customize(new AutoMoqCustomization());
            _fixture.OmitAutoProperties = true;

            _mockChatRoomsRepo = _fixture.Freeze<Mock<IChatRoomsRepo>>();
            _mockUsersRepo = _fixture.Freeze<Mock<IUsersRepo>>();

            _sut = _fixture.Create<ChatRoomController>();
        }

        [Theory]
        [InlineData(null)]
        [InlineData("")]
        [InlineData("123")]
        [InlineData("1234567")]
        public async Task CreateChatRoomAsync_chatRoomToAdd_MustHaveASixCharacterId(string? id)
        {
            var chatRoomToAdd = new ChatRoomModel { Id = id };

            var actionResult = await _sut.CreateChatRoomAsync(chatRoomToAdd);

            Assert.IsType<BadRequestObjectResult>(actionResult);
        }

        [Fact]
        public async Task CreateChatRoomAsync_ExistingId_ReturnsBadRequest()
        {
            // Arrange
            var id = "123456";
            var chatRoomToAdd = new ChatRoomModel { Id = id };

            _mockChatRoomsRepo
                .Setup(repo => repo.GetChatRoomAsync(id))
                .ReturnsAsync(new ChatRoom { Id = id });

            // Act
            var actionResult = await _sut.CreateChatRoomAsync(chatRoomToAdd);

            Assert.IsType<BadRequestObjectResult>(actionResult);
        }

        [Fact]
        public async Task CreateChatRoomAsync_ValidId_ReturnsOk()
        {
            // Arrange
            var chatRoomToAdd = new ChatRoomModel { Id = "123456" };

            _mockChatRoomsRepo
                .Setup(repo => repo.GetChatRoomAsync(It.IsAny<string>()))
                .ReturnsAsync((ChatRoom?)null);

            // Act
            var actionResult = await _sut.CreateChatRoomAsync(chatRoomToAdd);

            // Assert
            Assert.IsType<OkResult>(actionResult);
        }

        [Fact]
        public async Task AddUserToChatRoomAsync_ChatRoomDoesNotExist_ReturnsBadRequest()
        {
            // Arrange
            var chatRoomId = "123";

            _mockChatRoomsRepo
                .Setup(repo => repo.GetChatRoomAsync(chatRoomId))
                .ReturnsAsync((ChatRoom?)null);

            // Act
            var actionResult = await _sut.AddUserToChatRoomAsync(chatRoomId, null);

            // Assert
            Assert.IsType<BadRequestObjectResult>(actionResult);
        }

        [Fact]
        public async Task AddUserToChatRoomAsync_UserDoesNotExist_ReturnsBadRequest()
        {
            // Arrange
            var userId = 123;
            var userToAdd = new UserModel { Id = userId };

            _mockUsersRepo
                .Setup(repo => repo.GetUserAsync(userId))
                .ReturnsAsync((User?)null);

            // Act
            var actionResult = await _sut.AddUserToChatRoomAsync("123456", userToAdd);

            // Assert
            Assert.IsType<BadRequestObjectResult>(actionResult);
        }

        [Fact]
        public async Task AddUserToChatRoomAsync_UserAlreadyInChatRoom_ReturnsBadRequest()
        {
            // Arrange
            var userId = 123;
            var userToAdd = new UserModel { Id = userId };
            var chatRoom = new ChatRoom
            {
                Id = "123456",
                Users = new List<User> { new User { Id = userId } }
            };

            _mockChatRoomsRepo
                .Setup(repo => repo.GetChatRoomAsync(chatRoom.Id))
                .ReturnsAsync(chatRoom);
            _mockUsersRepo
                .Setup(repo => repo.GetUserAsync(userId))
                .ReturnsAsync((User?)null);

            // Act
            var actionResult = await _sut.AddUserToChatRoomAsync(chatRoom.Id, userToAdd);

            // Assert
            Assert.IsType<BadRequestObjectResult>(actionResult);
        }
    }
}
