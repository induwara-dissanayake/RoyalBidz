# RoyalBidz Backend Development Guide

## ??? Architecture

The backend follows Clean Architecture principles with:
- **Controllers**: Handle HTTP requests and responses
- **Services**: Business logic and validation
- **Repositories**: Data access abstraction
- **Models**: Entity definitions
- **DTOs**: Data transfer objects for API responses

## ?? Getting Started

### Prerequisites
- .NET 8 SDK
- MySQL Server
- IDE (Visual Studio, VS Code, or Rider)

### Setup
1. Navigate to backend directory: `cd RoyalBidz.Server`
2. Restore packages: `dotnet restore`
3. Update database connection in `appsettings.json`
4. Run the application: `dotnet run`

## ?? Development Workflow

### Adding a New Model

1. **Create the Entity Model** (`Models/YourModel.cs`)
   ```csharp
   public class YourModel
   {
       public int Id { get; set; }
       public string Name { get; set; }
       public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
       
       // Navigation properties
       public virtual User CreatedBy { get; set; }
   }
   ```

2. **Update DbContext** (`Data/RoyalBidzDbContext.cs`)
   ```csharp
   public DbSet<YourModel> YourModels { get; set; }
   ```

3. **Create DTOs** (`DTOs/YourModelDtos.cs`)
   ```csharp
   public class YourModelDto
   {
       public int Id { get; set; }
       public string Name { get; set; }
       public DateTime CreatedAt { get; set; }
   }
   
   public class CreateYourModelDto
   {
       public string Name { get; set; }
   }
   ```

4. **Update AutoMapper Profile** (`Mappings/MappingProfile.cs`)
   ```csharp
   CreateMap<YourModel, YourModelDto>();
   CreateMap<CreateYourModelDto, YourModel>();
   ```

5. **Create Repository Interface** (`Repositories/Interfaces/IYourModelRepository.cs`)
   ```csharp
   public interface IYourModelRepository : IGenericRepository<YourModel>
   {
       Task<IEnumerable<YourModel>> GetByNameAsync(string name);
   }
   ```

6. **Implement Repository** (`Repositories/Implementations/YourModelRepository.cs`)
   ```csharp
   public class YourModelRepository : GenericRepository<YourModel>, IYourModelRepository
   {
       public YourModelRepository(RoyalBidzDbContext context) : base(context) { }
       
       public async Task<IEnumerable<YourModel>> GetByNameAsync(string name)
       {
           return await _context.YourModels
               .Where(x => x.Name.Contains(name))
               .ToListAsync();
       }
   }
   ```

7. **Create Service Interface** (`Services/Interfaces/IYourModelService.cs`)
   ```csharp
   public interface IYourModelService
   {
       Task<IEnumerable<YourModelDto>> GetAllAsync();
       Task<YourModelDto> GetByIdAsync(int id);
       Task<YourModelDto> CreateAsync(CreateYourModelDto dto);
       Task<YourModelDto> UpdateAsync(int id, CreateYourModelDto dto);
       Task<bool> DeleteAsync(int id);
   }
   ```

8. **Implement Service** (`Services/Implementations/YourModelService.cs`)
   ```csharp
   public class YourModelService : IYourModelService
   {
       private readonly IYourModelRepository _repository;
       private readonly IMapper _mapper;
       
       public YourModelService(IYourModelRepository repository, IMapper mapper)
       {
           _repository = repository;
           _mapper = mapper;
       }
       
       public async Task<IEnumerable<YourModelDto>> GetAllAsync()
       {
           var entities = await _repository.GetAllAsync();
           return _mapper.Map<IEnumerable<YourModelDto>>(entities);
       }
       
       // Implement other methods...
   }
   ```

9. **Create Controller** (`Controllers/YourModelController.cs`)
   ```csharp
   [ApiController]
   [Route("api/[controller]")]
   public class YourModelController : ControllerBase
   {
       private readonly IYourModelService _service;
       
       public YourModelController(IYourModelService service)
       {
           _service = service;
       }
       
       [HttpGet]
       public async Task<ActionResult<IEnumerable<YourModelDto>>> GetAll()
       {
           var result = await _service.GetAllAsync();
           return Ok(result);
       }
       
       [HttpPost]
       [Authorize(Roles = "Admin,Seller")]
       public async Task<ActionResult<YourModelDto>> Create(CreateYourModelDto dto)
       {
           var result = await _service.CreateAsync(dto);
           return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
       }
   }
   ```

10. **Register Services** (`Program.cs`)
    ```csharp
    builder.Services.AddScoped<IYourModelRepository, YourModelRepository>();
    builder.Services.AddScoped<IYourModelService, YourModelService>();
    ```

### Adding Authentication to Endpoints

Use these attributes on controllers or actions:
- `[Authorize]` - Requires authentication
- `[Authorize(Roles = "Admin")]` - Requires specific role
- `[Authorize(Roles = "Admin,Seller")]` - Requires one of multiple roles

### Database Migrations

Currently using `EnsureCreated()` for simplicity. For production:
1. Install EF tools: `dotnet tool install --global dotnet-ef`
2. Add migration: `dotnet ef migrations add MigrationName`
3. Update database: `dotnet ef database update`

## ?? Configuration

### Environment Variables
Set these for different environments:
- `ASPNETCORE_ENVIRONMENT` - Development/Production
- `ConnectionStrings__DefaultConnection` - Database connection
- `JwtSettings__SecretKey` - JWT secret key

### Logging
Configured in `appsettings.json`. Logs are written to console and can be extended to files/external services.

## ?? Testing

### API Testing
1. Use Swagger UI at `https://localhost:7006/swagger`
2. For authentication endpoints, first login to get JWT token
3. Use "Authorize" button in Swagger to set Bearer token

### Sample API Calls
```bash
# Login
POST /api/auth/login
{
  "email": "admin@royalbidz.com",
  "password": "Admin123!"
}

# Get auctions (authenticated)
GET /api/auctions
Authorization: Bearer <your-jwt-token>
```

## ?? Security Best Practices

1. **Always validate input** in DTOs and services
2. **Use authorization attributes** on sensitive endpoints
3. **Sanitize user input** to prevent injection attacks
4. **Log security events** (failed logins, unauthorized access)
5. **Keep secrets out of code** - use configuration/environment variables

## ?? Database Schema

Key entities and relationships:
- **User** ? Has many **Auctions** (as seller)
- **User** ? Has many **Bids** (as bidder)  
- **Auction** ? Belongs to **JewelryItem**
- **Auction** ? Has many **Bids**
- **Bid** ? May have **Payment**

## ?? SignalR Integration

For real-time features, use the `AuctionHub`:
```csharp
// In service, inject IHubContext<AuctionHub>
await _hubContext.Clients.Group($"auction_{auctionId}")
    .SendAsync("BidUpdated", bidDto);
```

## ?? Project Structure

```
RoyalBidz.Server/
??? Controllers/              # API endpoints
??? Services/
?   ??? Interfaces/          # Service contracts
?   ??? Implementations/     # Business logic
?   ??? BackgroundServices/  # Background tasks
??? Repositories/
?   ??? Interfaces/          # Repository contracts
?   ??? Implementations/     # Data access
??? Models/                  # Entity definitions
??? DTOs/                    # API data contracts
??? Data/                    # Database context
??? Hubs/                    # SignalR hubs
??? Mappings/                # AutoMapper profiles
??? Program.cs               # App configuration
```