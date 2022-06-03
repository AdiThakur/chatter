using Chatter.Data.Entities;
using Chatter.Data.Repos;
using Moq;
using System.Threading.Tasks;
using Xunit;
using AutoFixture;
using AutoFixture.AutoMoq;
using System.Collections.Generic;
using Chatter.Services;

namespace Chatter.Tests.Controllers
{
    public class ChatRoomServiceTests
    {
        private readonly IFixture _fixture;

        private readonly Mock<IChatRoomsRepo> _mockChatRoomsRepo;
        private readonly Mock<IUsersRepo> _mockUsersRepo;

        private readonly ChatRoomService _sut;

        public ChatRoomServiceTests()
        {
            _fixture = new Fixture().Customize(new AutoMoqCustomization());

            _mockChatRoomsRepo = _fixture.Freeze<Mock<IChatRoomsRepo>>();
            _mockUsersRepo = _fixture.Freeze<Mock<IUsersRepo>>();

            _sut = _fixture.Create<ChatRoomService>();
        }

        [Fact]
        public async Task CreateChatRoomAsync_ChatRoomExists_ThrowsUserException()
        {
            // Arrange
            var id = "123456";
            var desc = "description";

            _mockChatRoomsRepo
                .Setup(repo => repo.GetChatRoomAsync(id))
                .ReturnsAsync(new ChatRoom { Id = id, Description = desc });

            // Act
            var uex = await Assert.ThrowsAsync<UserException>(
                () => _sut.CreateChatRoomAsync(id, desc)
            );

            // Assert
            Assert.Equal("Invalid ChatRoom Id", uex.Title);
        }

        [Fact]
        public async Task AddUserToChatRoomAsync_ChatRoomDoesNotExist_ThrowsUserException()
        {
            // Arrange
            var chatRoomId = "123456";
            var userId = 123456;

            _mockChatRoomsRepo
                .Setup(repo => repo.GetChatRoomAsync(chatRoomId))
                .ReturnsAsync((ChatRoom?)null);

            // Act
            var uex = await Assert.ThrowsAsync<UserException>(
                () => _sut.AddUserToChatRoomAsync(chatRoomId, userId)
            );

            // Assert
            Assert.Equal("Invalid ChatRoom Id", uex.Title);
        }

        [Fact]
        public async Task AddUserToChatRoomAsync_UserDoesNotExist_ThrowsUserException()
        {
            // Arrange
            var chatRoomId = "123456";
            var userId = 123456;

            _mockUsersRepo
                .Setup(repo => repo.GetUserAsync(userId))
                .ReturnsAsync((User?)null);

            // Act
            var uex = await Assert.ThrowsAsync<UserException>(
                () => _sut.AddUserToChatRoomAsync(chatRoomId, userId)
            );

            // Assert
            Assert.Equal("Invalid Username", uex.Title);
        }

        [Fact]
        public async Task AddUserToChatRoomAsync_UserAlreadyInChatRoom_ReturnsBadRequest()
        {
            // Arrange
            var chatRoomId = "123456";
            var userId = 123456;
            var storedUser = new User { Id = userId };

            _mockUsersRepo
                .Setup(repo => repo.GetUserAsync(userId))
                .ReturnsAsync(storedUser);
            _mockChatRoomsRepo
                .Setup(repo => repo.GetChatRoomAsync(chatRoomId))
                .ReturnsAsync(
                    new ChatRoom
                    {
                        Id = chatRoomId,
                        Users = new List<User> { storedUser }
                    }
                );

            // Act
            var uex = await Assert.ThrowsAsync<UserException>(
                () => _sut.AddUserToChatRoomAsync(chatRoomId, userId)
            );

            // Assert
            Assert.Equal("User is already in ChatRoom", uex.Title);
        }
    }
}
