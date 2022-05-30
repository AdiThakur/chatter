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
    }
}
