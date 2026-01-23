using System.Runtime.Serialization;

namespace Recipes.Entities;

using System.Text.Json.Serialization;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum Unit
{
    [EnumMember(Value = "g")]
    Gram,

    [EnumMember(Value = "kg")]
    Kilogram,

    [EnumMember(Value = "ml")]
    Milliliter,

    [EnumMember(Value = "l")]
    Liter,

    [EnumMember(Value = "szt")]
    Piece
}
