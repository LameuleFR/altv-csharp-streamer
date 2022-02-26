using AltV.Net;
using AltV.Net.EntitySync;
using System;
using System.Collections.Generic;
using System.Numerics;

namespace EntityStreamer
{
    public enum TextureVariation
    {
        Pacific = 0,
        Azure = 1,
        Nautical = 2,
        Continental = 3,
        Battleship = 4,
        Intrepid = 5,
        Uniform = 6,
        Classico = 7,
        Mediterranean = 8,
        Command = 9,
        Mariner = 10,
        Ruby = 11,
        Vintage = 12,
        Pristine = 13,
        Merchant = 14,
        Voyager = 15
    }

    public class MoveData : IWritable
    {
        public float X { get; set; }
        public float Y { get; set; }
        public float Z { get; set; }
        public float Speed { get; set; }

        public void OnWrite(IMValueWriter writer)
        {
            writer.BeginObject();
            writer.Name("X");
            writer.Value(X);
            writer.Name("Y");
            writer.Value(Y);
            writer.Name("Z");
            writer.Value(Z);
            writer.Name("Speed");
            writer.Value(Speed);
            writer.EndObject();
        }
    }

    public class Rgb : IWritable
    {
        public int Red { get; set; }
        public int Green { get; set; }
        public int Blue { get; set; }

        public Rgb(int red, int green, int blue)
        {
            Red = red;
            Green = green;
            Blue = blue;
        }

        public void OnWrite(IMValueWriter writer)
        {
            writer.BeginObject();
            writer.Name("Red");
            writer.Value(Red);
            writer.Name("Green");
            writer.Value(Green);
            writer.Name("Blue");
            writer.Value(Blue);
            writer.EndObject();
        }
    }

    /// <summary>
    /// DynamicObject class that stores all data related to a single object
    /// </summary>
    public class Prop : Entity, IEntity
    {
        private static List<Prop> propList = new();

        public static List<Prop> PropList
        {
            get
            {
                lock (propList)
                {
                    return propList;
                }
            }
            set
            {
                propList = value;
            }
        }

        public AltV.Net.Elements.Entities.IColShape colshape { get; set; }

        /// <summary>
        /// Set or get the current object's rotation (in degrees).
        /// </summary>
        public Vector3 Rotation
        {
            get
            {
                if (!TryGetData("rotation", out Dictionary<string, object> data))
                    return default;

                return new Vector3()
                {
                    X = Convert.ToSingle(data["x"]),
                    Y = Convert.ToSingle(data["y"]),
                    Z = Convert.ToSingle(data["z"]),
                };
            }
            set
            {
                // No data changed
                if (Rotation.X == value.X && Rotation.Y == value.Y && Rotation.Z == value.Z && value != new Vector3(0, 0, 0))
                    return;

                Dictionary<string, object> dict = new()
                {
                    ["x"] = value.X,
                    ["y"] = value.Y,
                    ["z"] = value.Z,
                };
                SetData("rotation", dict);
            }
        }

        public Vector3 Velocity
        {
            get
            {
                if (!TryGetData("velocity", out Dictionary<string, object> data))
                    return default;

                return new Vector3()
                {
                    X = Convert.ToSingle(data["x"]),
                    Y = Convert.ToSingle(data["y"]),
                    Z = Convert.ToSingle(data["z"]),
                };
            }
            set
            {
                // No data changed
                if (Velocity.X == value.X && Velocity.Y == value.Y && Velocity.Z == value.Z && value != new Vector3(0, 0, 0))
                    return;

                Dictionary<string, object> dict = new()
                {
                    ["x"] = value.X,
                    ["y"] = value.Y,
                    ["z"] = value.Z,
                };
                SetData("velocity", dict);
            }
        }

        public Vector3 SlideToPosition
        {
            get
            {
                if (!TryGetData("SlideToPosition", out Dictionary<string, object> data))
                    return default;

                return new Vector3()
                {
                    X = Convert.ToSingle(data["x"]),
                    Y = Convert.ToSingle(data["y"]),
                    Z = Convert.ToSingle(data["z"]),
                };
            }
            set
            {
                // No data changed

                Dictionary<string, object> dict = new Dictionary<string, object>()
                {
                    ["x"] = value.X,
                    ["y"] = value.Y,
                    ["z"] = value.Z,
                };
                //Log.Important("SetData SlideToPosition ");
                SetData("SlideToPosition", dict);
            }
        }

        /// <summary>
        /// Set or get the current object's model.
        /// </summary>
        public uint? Model
        {
            get
            {
                if (!TryGetData("model", out uint model))
                    return null;

                return model;
            }
            set
            {
                // No data changed
                if (Model == value)
                    return;

                SetData("model", value);
            }
        }

        /// <summary>
        /// Set or get LOD Distance of the object.
        /// </summary>
        public uint? LodDistance
        {
            get
            {
                if (!TryGetData("lodDistance", out uint lodDist))
                    return null;

                return lodDist;
            }
            set
            {
                // if value is set to null, reset the data
                if (value == null)
                {
                    SetData("lodDistance", null);
                    return;
                }

                // No data changed
                if (LodDistance == value)
                    return;

                SetData("lodDistance", value);
            }
        }

        /// <summary>
        /// Get or set the current texture variation, use null to reset it to default.
        /// </summary>
        public TextureVariation? TextureVariation
        {
            get
            {
                if (!TryGetData("textureVariation", out int variation))
                    return null;

                return (TextureVariation)variation;
            }
            set
            {
                // if value is set to null, reset the data
                if (value == null)
                {
                    SetData("textureVariation", null);
                    return;
                }

                // No data changed
                if (TextureVariation == value)
                    return;

                SetData("textureVariation", (int)value);
            }
        }

        /// <summary>
        /// Get or set the object's dynamic state. Some objects can be moved around by the player when dynamic is set to true.
        /// </summary>
        public bool? Dynamic
        {
            get
            {
                if (!TryGetData("dynamic", out bool isDynamic))
                    return false;

                return isDynamic;
            }
            set
            {
                // if value is set to null, reset the data
                if (value == null)
                {
                    SetData("dynamic", null);
                    return;
                }

                // No data changed
                if (Dynamic == value)
                    return;

                SetData("dynamic", value);
            }
        }

        /// <summary>
        /// Set/get visibility state of object
        /// </summary>
        public bool? Visible
        {
            get
            {
                if (!TryGetData("visible", out bool visible))
                    return false;

                return visible;
            }
            set
            {
                // if value is set to null, reset the data
                if (value == null)
                {
                    SetData("visible", null);
                    return;
                }

                // No data changed
                if (Visible == value)
                    return;

                SetData("visible", value);
            }
        }

        /// <summary>
        /// Set/get an object on fire, NOTE: does not work very well as of right now, fire is very small.
        /// </summary>
        public bool? OnFire
        {
            get
            {
                if (!TryGetData("onFire", out bool onFire))
                    return false;

                return onFire;
            }
            set
            {
                // if value is set to null, reset the data
                if (value == null)
                {
                    SetData("onFire", null);
                    return;
                }

                // No data changed
                if (OnFire == value)
                    return;

                SetData("onFire", value);
            }
        }

        /// <summary>
        /// Freeze an object into it's current position. or get it's status
        /// </summary>
        public bool? Freeze
        {
            get
            {
                if (!TryGetData("freeze", out bool frozen))
                    return false;

                return frozen;
            }
            set
            {
                // if value is set to null, reset the data
                if (value == null)
                {
                    SetData("freeze", null);
                    return;
                }

                // No data changed
                if (Freeze == value)
                    return;

                SetData("freeze", value);
            }
        }

        /// <summary>
        /// Set the light color of the object, use null to reset it to default.
        /// </summary>
        public Rgb LightColor
        {
            get
            {
                if (!TryGetData("lightColor", out Dictionary<string, object> data))
                    return null;

                return new Rgb(
                    Convert.ToInt32(data["r"]),
                    Convert.ToInt32(data["g"]),
                    Convert.ToInt32(data["b"])
                );
            }
            set
            {
                // if value is set to null, reset the data
                if (value == null)
                {
                    SetData("lightColor", null);
                    return;
                }

                // No data changed
                if (LightColor.Red == value.Red && LightColor.Green == value.Green && LightColor.Blue == value.Blue)
                    return;

                Dictionary<string, object> dict = new()
                {
                    { "r", value.Red },
                    { "g", value.Green },
                    { "b", value.Blue }
                };
                SetData("lightColor", dict);
            }
        }

        public Vector3 PositionInitial { get; internal set; }

        public Prop(Vector3 position, int dimension, uint range, ulong entityType) : base(entityType, position, dimension, range)
        {
        }

        public void SetRotation(Vector3 rot)
        {
            Rotation = rot;
        }

        public void SetPosition(Vector3 pos)
        {
            Position = pos;
        }

        public void Delete()
        {
            Prop.PropList.Remove(this);
            AltEntitySync.RemoveEntity(this);
        }

        public void Destroy()
        {
            Prop.PropList.Remove(this);
            AltEntitySync.RemoveEntity(this);
        }
    }

    public static class PropStreamer
    {
        /// <summary>
        /// Create a new dynamic object.
        /// </summary>
        /// <param name="model">The object model name.</param>
        /// <param name="position">The position to spawn the object at.</param>
        /// <param name="rotation">The rotation to spawn the object at(degrees).</param>
        /// <param name="dimension">The dimension to spawn the object in.</param>
        /// <param name="isDynamic">(Optional): Set object dynamic or not.</param>
        /// <param name="frozen">(Optional): Set object frozen.</param>
        /// <param name="lodDistance">(Optional): Set LOD distance.</param>
        /// <param name="lightColor">(Optional): set light color.</param>
        /// <param name="onFire">(Optional): set object on fire(DOESN'T WORK PROPERLY YET!)</param>
        /// <param name="textureVariation">(Optional): Set object texture variation.</param>
        /// <param name="visible">(Optional): Set object visibility.</param>
        /// <param name="streamRange">(Optional): The range that a player has to be in before the object spawns, default value is 400.</param>
        /// <returns>The newly created dynamic object.</returns>
        public static Prop Create(
            uint model, Vector3 position, Vector3 rotation, int dimension = 0, bool? isDynamic = null, bool? placeObjectOnGroundProperly = false, bool? frozen = null, uint? lodDistance = null,
            Rgb lightColor = null, bool? onFire = null, TextureVariation? textureVariation = null, bool? visible = null, uint streamRange = 520
        )
        {
            Prop obj = new Prop(position, dimension, streamRange, 2)
            {
                Rotation = rotation,
                Model = model,
                Dynamic = isDynamic ?? null,
                Freeze = frozen ?? null,
                LodDistance = lodDistance ?? null,
                LightColor = lightColor ?? null,
                OnFire = onFire ?? null,
                TextureVariation = textureVariation ?? null,
                Visible = visible ?? null,
                PositionInitial = position,
            };
            Prop.PropList.Add(obj);
            AltEntitySync.AddEntity(obj);
            return obj;
        }

        public static bool Delete(ulong dynamicObjectId)
        {
            Prop obj = GetProp(dynamicObjectId);

            if (obj == null)
                return false;
            Prop.PropList.Remove(obj);
            AltEntitySync.RemoveEntity(obj);
            return true;
        }

        public static void Delete(Prop obj)
        {
            Prop.PropList.Remove(obj);
            AltEntitySync.RemoveEntity(obj);
        }

        public static Prop GetProp(ulong dynamicObjectId)
        {
            if (!AltEntitySync.TryGetEntity(dynamicObjectId, 2, out IEntity entity))
            {
                Console.WriteLine($"[Prop-Stream] [GetProp] ERROR: Entity with ID { dynamicObjectId } couldn't be found.");
                return default;
            }

            if (!(entity is Prop))
                return default;

            return (Prop)entity;
        }

        /// <summary>
        /// Destroy all created dynamic objects.
        /// </summary>
        public static void DestroyAllDynamicObjects()
        {
            foreach (Prop obj in GetAllProp())
            {
                AltEntitySync.RemoveEntity(obj);
            }
            Prop.PropList.Clear();
        }

        /// <summary>
        /// Get all created dynamic objects.
        /// </summary>
        /// <returns>A list of dynamic objects.</returns>
        public static List<Prop> GetAllProp()
        {
            List<Prop> objects = new List<Prop>();

            foreach (IEntity entity in Prop.PropList)
            {
                Prop obj = GetProp(entity.Id);

                if (obj != null)
                    objects.Add(obj);
            }

            return objects;
        }

        /// <summary>
        /// Get the dynamic object that's closest to a specified position.
        /// </summary>
        /// <param name="pos">The position from which to check.</param>
        /// <returns>The closest dynamic object to the specified position, or null if none found.</returns>
        public static (Prop obj, float distance) GetClosestDynamicObject(Vector3 pos)
        {
            if (GetAllProp().Count == 0)
                return (null, 5000);

            Prop obj = null;
            float distance = 5000;

            foreach (Prop o in GetAllProp())
            {
                float dist = Vector3.Distance(o.Position, pos);
                if (dist < distance)
                {
                    obj = o;
                    distance = dist;
                }
            }

            return (obj, distance);
        }
    }
}