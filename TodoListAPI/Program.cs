using System.Data;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Localization;
using Microsoft.EntityFrameworkCore;
using TodoListAPI.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<TodoListContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("TodoListConnectionString") ?? 
        throw new InvalidOperationException("Connection string 'MovieContext' not found.")));

var app = builder.Build();

app.UseRequestLocalization( new RequestLocalizationOptions
    {
        DefaultRequestCulture = new RequestCulture("en-US")
    }
);

using (var context = new TodoListContext( 
    app.Services.CreateScope().ServiceProvider.GetRequiredService<DbContextOptions<TodoListContext>>()))
context.Database.EnsureCreated();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapGet("/todolist", async (TodoListContext dbContext) => await dbContext.Todos.ToListAsync() );

app.MapGet("/todolist/{id}", async (TodoListContext dbContext, int id) => {
        var todoItem = await dbContext.Todos.FindAsync(id);
        if(todoItem is null)
        {
            return Results.NotFound();
        }
        else
            return Results.Ok(todoItem);
    });

app.MapPost( "/todolist", async (TodoListContext dbContext, Todo todoItem) => 
    {
        dbContext.Todos.Add(todoItem);
        try
        {
            await dbContext.SaveChangesAsync();
        }
        catch
        {
            return Results.BadRequest();
        }
        return Results.Created($"todolist/{todoItem.Id}", todoItem);
    });

app.MapDelete("/todolist/delete/{id}", async( TodoListContext dbContext, int id) =>
    {
        var todoItem = await dbContext.Todos.FindAsync(id);
        if (todoItem != null)
        {
            dbContext.Todos.Remove(todoItem);
        }
        else
            return Results.NotFound();

        await dbContext.SaveChangesAsync();
        return Results.Ok();
    });

app.MapPut("/todolist/update/{id}", async( TodoListContext dbContext, Todo todoItem, int id) => 
    {
        if(id != todoItem.Id)
            return Results.BadRequest();

        if (todoItem != null && dbContext.Todos.Any( p => p.Id == todoItem.Id ) )
        {
            try
            {
                dbContext.Todos.Update(todoItem);
                await dbContext.SaveChangesAsync();
            }
            catch(DBConcurrencyException)
            {
                return Results.StatusCode(500);
            }
        }
        else
            return Results.NotFound();

        return Results.Ok(todoItem);
    });

app.Run();
