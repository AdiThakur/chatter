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

        public static UserModel? ToModel(this User? userEntity)
        {
            if (userEntity == null)
            {
                return null;
            }

            return new UserModel(userEntity);
        }
    }
}
