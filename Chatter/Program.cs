using Chatter.Data;
using Chatter.Data.Repos;

namespace Chatter
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            builder.Services.AddDbContext<ChatterContext>();

            RegisterRepos(builder.Services);

            var app = builder.Build();

            // Configure the HTTP request pipeline.

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }

        public static void RegisterRepos(IServiceCollection services)
        {
            services.AddScoped<IChatRoomsRepo, ChatRoomsRepo>();
            services.AddScoped<MessagesRepo>();
            services.AddScoped<IUsersRepo, UsersRepo>();
        }
    }
}
