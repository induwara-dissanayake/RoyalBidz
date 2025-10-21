using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using Microsoft.AspNetCore.Mvc;
using System.Reflection;

namespace RoyalBidz.Server.Filters
{
    public class FileUploadOperationFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            // Check if any parameter has FromForm attribute
            var formParameters = context.MethodInfo.GetParameters()
                .Where(p => p.GetCustomAttribute<FromFormAttribute>() != null)
                .ToArray();

            if (formParameters.Length == 0)
                return;

            // Clear existing parameters since we'll be using request body instead
            operation.Parameters?.Clear();

            // Create multipart/form-data request body
            operation.RequestBody = new OpenApiRequestBody
            {
                Content = new Dictionary<string, OpenApiMediaType>
                {
                    ["multipart/form-data"] = new OpenApiMediaType
                    {
                        Schema = new OpenApiSchema
                        {
                            Type = "object",
                            Properties = new Dictionary<string, OpenApiSchema>(),
                            Required = new HashSet<string>()
                        }
                    }
                }
            };

            var schema = operation.RequestBody.Content["multipart/form-data"].Schema;

            foreach (var parameter in formParameters)
            {
                var parameterName = parameter.Name!;
                var parameterType = parameter.ParameterType;

                // Handle nullable types
                var underlyingType = Nullable.GetUnderlyingType(parameterType) ?? parameterType;

                OpenApiSchema propertySchema;

                if (parameterType == typeof(IFormFile))
                {
                    propertySchema = new OpenApiSchema
                    {
                        Type = "string",
                        Format = "binary"
                    };
                }
                else if (parameterType == typeof(IFormFile[]) ||
                         parameterType == typeof(List<IFormFile>) ||
                         parameterType == typeof(IEnumerable<IFormFile>))
                {
                    propertySchema = new OpenApiSchema
                    {
                        Type = "array",
                        Items = new OpenApiSchema
                        {
                            Type = "string",
                            Format = "binary"
                        }
                    };
                }
                else if (underlyingType == typeof(string))
                {
                    propertySchema = new OpenApiSchema
                    {
                        Type = "string"
                    };
                }
                else if (underlyingType == typeof(int))
                {
                    propertySchema = new OpenApiSchema
                    {
                        Type = "integer",
                        Format = "int32"
                    };
                }
                else if (underlyingType == typeof(long))
                {
                    propertySchema = new OpenApiSchema
                    {
                        Type = "integer",
                        Format = "int64"
                    };
                }
                else if (underlyingType == typeof(bool))
                {
                    propertySchema = new OpenApiSchema
                    {
                        Type = "boolean"
                    };
                }
                else if (underlyingType == typeof(decimal) || 
                         underlyingType == typeof(double) || 
                         underlyingType == typeof(float))
                {
                    propertySchema = new OpenApiSchema
                    {
                        Type = "number"
                    };
                }
                else
                {
                    // Default to string for other types
                    propertySchema = new OpenApiSchema
                    {
                        Type = "string"
                    };
                }

                schema.Properties[parameterName] = propertySchema;

                // Add to required if parameter doesn't have a default value and is not nullable
                if (!parameter.HasDefaultValue && 
                    Nullable.GetUnderlyingType(parameter.ParameterType) == null &&
                    parameter.ParameterType != typeof(string))
                {
                    schema.Required.Add(parameterName);
                }
            }
        }
    }
}
