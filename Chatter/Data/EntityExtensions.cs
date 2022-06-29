using Chatter.Data.Entities;
using Chatter.Data.Models;

namespace Chatter.Data
{
    public static class EntityExtensions
    {
        public static ChatRoomModel? ToModel(this ChatRoom? chatRoomEntity)
        {
            if (chatRoomEntity == null)
            {
                return null;
            }

            return new ChatRoomModel(chatRoomEntity);
        }

        public static List<ChatRoomModel?> ToModels(this List<ChatRoom> chatRoomEntities)
        {
            return chatRoomEntities.Select(chatRoomEntity => chatRoomEntity.ToModel()).ToList();
        }

        public static UserModel? ToModel(this User? userEntity)
        {
            if (userEntity == null)
            {
                return null;
            }

            return new UserModel(userEntity);
        }

        public static List<UserModel?> ToModels(this List<User> userEntities)
        {
            return userEntities.Select(userEntity => userEntity.ToModel()).ToList();
        }

        public static MessageModel? ToModel(this Message? messageEntity)
        {
            if (messageEntity == null)
            {
                return null;
            }

            return new MessageModel(messageEntity);
        }

        public static List<MessageModel?> ToModels(this List<Message> messageEntities)
        {
            return messageEntities.Select(messageEntity => messageEntity.ToModel()).ToList();
        }
    }
}
