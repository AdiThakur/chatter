using Chatter.Controllers;
using Chatter.Data.Models;
using Chatter.Data.Repos;
using Moq;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Xunit;
using AutoFixture;
using AutoFixture.AutoMoq;

namespace Chatter.Tests.Controllers
{
    public class ChatRoomControllerTests
    {
        private readonly IFixture _fixture;

        private readonly Mock<IChatRoomsRepo> _mockChatRoomsRepo;

        private readonly ChatRoomController _sut;

        public ChatRoomControllerTests()
        {
            _fixture = new Fixture()
                .Customize(new AutoMoqCustomization());
            _fixture.OmitAutoProperties = true;

            _mockChatRoomsRepo = _fixture.Freeze<Mock<IChatRoomsRepo>>();

            _sut = _fixture.Create<ChatRoomController>();
        }

        [Theory]
        [InlineData(null)]
        [InlineData("")]
        [InlineData("123")]
        [InlineData("1234567")]
        public async Task CreateChatRoomAsync_chatRoomToAdd_MustHaveASixCharacterId(string? id)
        {
            var chatRoomToAdd = new ChatRoom { Id = id };

            var actionResult = await _sut.CreateChatRoomAsync(chatRoomToAdd);

            Assert.IsType<BadRequestObjectResult>(actionResult);
        }

        [Fact]
        public async Task CreateChatRoomAsync_ExistingId_ReturnsBadRequest()
        {
            // Arrange
            var id = "123456";
            var chatRoomToAdd = new ChatRoom { Id = id };

            _mockChatRoomsRepo
                .Setup(repo => repo.GetChatRoomAsync(It.Is<string>(newId => newId == id)))
                .ReturnsAsync(new ChatRoom { Id = id });

            // Act
            var actionResult = await _sut.CreateChatRoomAsync(chatRoomToAdd);

            Assert.IsType<BadRequestObjectResult>(actionResult);
        }

        [Fact]
        public async Task CreateChatRoomAsync_ValidId_ReturnsOk()
        {
            // Arrange
            var chatRoomToAdd = new ChatRoom { Id = "123456" };

            _mockChatRoomsRepo
                .Setup(repo => repo.GetChatRoomAsync(It.IsAny<string>()))
                .ReturnsAsync((ChatRoom?)null);

            // Act
            var actionResult = await _sut.CreateChatRoomAsync(chatRoomToAdd);

            // Assert
            Assert.IsType<OkResult>(actionResult);
        }

        [Theory]
        [InlineData(null)]
        [InlineData("")]
        [InlineData("123")]
        [InlineData("1234567")]
        public async Task AddUserToChatRoomAsync_chatRoomId_MustBeSixCharactersLong(string? id)
        {
            var actionResult = await _sut.AddUserToChatRoomAsync(id, 123);

            Assert.IsType<BadRequestObjectResult>(actionResult);
        }

        [Fact]
        public async Task AddUserToChatRoomAsync_NullUserToAddId_ReturnsBadRequest()
        {
            var actionResult = await _sut.AddUserToChatRoomAsync("123456", null);

            Assert.IsType<BadRequestObjectResult>(actionResult);
        }
    }
}
