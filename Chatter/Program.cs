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

// TODO
// 1. Add MessageController
// 2. Add tests for MessageController
// 3. Update all of the controllers to ensure that their actions accept and return models, and not entities
// 4. Need to introduce a layer to house all of the business logic. Currently, the controllers are responsible for this.
//    I want my controllers to be slim, and only reponsible for API related tasks, such as enforcing authentication and authorization.
