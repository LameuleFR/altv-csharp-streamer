using AltV.Net.Data;
using AltV.Net.EntitySync;
using System;
using System.Collections.Generic;
using System.Numerics;

namespace EntityStreamer
{
    /// <summary>
    /// Marker types.
    /// </summary>
    public enum MarkerTypes
    {
        MarkerTypeUpsideDownCone = 0,
        MarkerTypeVerticalCylinder = 1,
        MarkerTypeThickChevronUp = 2,
        MarkerTypeThinChevronUp = 3,
        MarkerTypeCheckeredFlagRect = 4,
        MarkerTypeCheckeredFlagCircle = 5,
        MarkerTypeVerticleCircle = 6,
        MarkerTypePlaneModel = 7,
        MarkerTypeLostMCDark = 8,
        MarkerTypeLostMCLight = 9,
        MarkerTypeNumber0 = 10,
        MarkerTypeNumber1 = 11,
        MarkerTypeNumber2 = 12,
        MarkerTypeNumber3 = 13,
        MarkerTypeNumber4 = 14,
        MarkerTypeNumber5 = 15,
        MarkerTypeNumber6 = 16,
        MarkerTypeNumber7 = 17,
        MarkerTypeNumber8 = 18,
        MarkerTypeNumber9 = 19,
        MarkerTypeChevronUpx1 = 20,
        MarkerTypeChevronUpx2 = 21,
        MarkerTypeChevronUpx3 = 22,
        MarkerTypeHorizontalCircleFat = 23,
        MarkerTypeReplayIcon = 24,
        MarkerTypeHorizontalCircleSkinny = 25,
        MarkerTypeHorizontalCircleSkinny_Arrow = 26,
        MarkerTypeHorizontalSplitArrowCircle = 27,
        MarkerTypeDebugSphere = 28,
        MarkerTypeDallorSign = 29,
        MarkerTypeHorizontalBars = 30,
        MarkerTypeWolfHead = 31
    }

    /// <summary>
    /// DynamicMarker class that stores all data related to a single marker.
    /// </summary>
    public class Marker : Entity, IEntity
    {
        private ulong EntityType
        {
            get
            {
                if (!TryGetData("entityType", out ulong type))
                    return 999;
                return type;
            }
            set
            {
                // No data changed
                if (EntityType == value)
                    return;

                SetData("entityType", value);
            }
        }

        /// <summary>
        /// Set or get the current marker's rotation (in degrees).
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

        /// <summary>
        /// Set a texture dictionary, pass null to remove.
        /// </summary>
        public string TextureDict
        {
            get
            {
                if (!TryGetData("textureDict", out string textureDict))
                    return null;

                return textureDict;
            }
            set
            {
                if (value == null)
                {
                    SetData("textureDict", null);
                    return;
                }

                // No data changed
                if (TextureDict == value)
                    return;

                SetData("textureDict", value);
            }
        }

        /// <summary>
        /// Texture name, only applicable if TextureDict is set. pass null to reset value.
        /// </summary>
        public string TextureName
        {
            get
            {
                if (!TryGetData("textureName", out string textureName))
                    return null;

                return textureName;
            }
            set
            {
                if (value == null)
                {
                    SetData("textureName", null);
                    return;
                }

                // No data changed
                if (TextureName == value)
                    return;

                SetData("textureName", value);
            }
        }

        /// <summary>
        /// Whether the marker should rotate on the Y axis(heading).
        /// </summary>
        public bool? Rotate
        {
            get
            {
                if (!TryGetData("rotate", out bool rotate))
                    return false;

                return rotate;
            }
            set
            {
                // if value is set to null, reset the data
                if (value == null)
                {
                    SetData("rotate", false);
                    return;
                }

                // No data changed
                if (Rotate == value)
                    return;

                SetData("rotate", value);
            }
        }

        /// <summary>
        /// Whether the marker should be drawn onto the entity when they enter it.
        /// </summary>
        public bool? DrawOnEnter
        {
            get
            {
                if (!TryGetData("drawOnEnter", out bool drawOnEnter))
                    return false;

                return drawOnEnter;
            }
            set
            {
                // if value is set to null, reset the data
                if (value == null)
                {
                    SetData("drawOnEnter", false);
                    return;
                }

                // No data changed
                if (DrawOnEnter == value)
                    return;

                SetData("drawOnEnter", value);
            }
        }

        /// <summary>
        /// Whether the marker should rotate on the Y axis towards the player's camera.
        /// </summary>
        public bool? FaceCamera
        {
            get
            {
                if (!TryGetData("faceCam", out bool faceCamera))
                    return false;

                return faceCamera;
            }
            set
            {
                // if value is set to null, reset the data
                if (value == null)
                {
                    SetData("faceCam", false);
                    return;
                }

                // No data changed
                if (FaceCamera == value)
                    return;

                SetData("faceCam", value);
            }
        }

        /// <summary>
        /// Whether the marker should bob up and down.
        /// </summary>
        public bool? BobUpDown
        {
            get
            {
                if (!TryGetData("bobUpDown", out bool bobUpDown))
                    return false;

                return bobUpDown;
            }
            set
            {
                // if value is set to null, reset the data
                if (value == null)
                {
                    SetData("bobUpDown", false);
                    return;
                }

                // No data changed
                if (BobUpDown == value)
                    return;

                SetData("bobUpDown", value);
            }
        }

        /// <summary>
        /// Set scale of the marker.
        /// </summary>
        public Vector3 Scale
        {
            get
            {
                if (!TryGetData("scale", out Dictionary<string, object> data))
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
                if (Scale.X == value.X && Scale.Y == value.Y && Scale.Z == value.Z && value != new Vector3(0, 0, 0))
                    return;

                Dictionary<string, object> dict = new()
                {
                    ["x"] = value.X,
                    ["y"] = value.Y,
                    ["z"] = value.Z,
                };
                SetData("scale", dict);
            }
        }

        /// <summary>
        /// Represents a heading on each axis in which the marker should face, alternatively you can rotate each axis independently with Rotation and set Direction axis to 0.
        /// </summary>
        public Vector3 Direction
        {
            get
            {
                if (!TryGetData("direction", out Dictionary<string, object> data))
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
                if (Direction != null && Direction.X == value.X && Direction.Y == value.Y && Direction.Z == value.Z && value != new Vector3(0, 0, 0))
                    return;

                Dictionary<string, object> dict = new()
                {
                    ["x"] = value.X,
                    ["y"] = value.Y,
                    ["z"] = value.Z,
                };
                SetData("direction", dict);
            }
        }

        /// <summary>
        /// Set or get the current marker's type(see MarkerTypes enum).
        /// </summary>
        public MarkerTypes MarkerType
        {
            get
            {
                if (!TryGetData("markerType", out int markerType))
                    return default;

                return (MarkerTypes)markerType;
            }
            set
            {
                // No data changed
                if (MarkerType == value)
                    return;

                SetData("markerType", (int)value);
            }
        }

        /// <summary>
        /// Set marker color.
        /// </summary>
        public Rgba? Color
        {
            get
            {
                if (!TryGetData("color", out Dictionary<string, object> data))
                    return null;

                return new Rgba(
                    Convert.ToByte(data["r"]),
                    Convert.ToByte(data["g"]),
                    Convert.ToByte(data["b"]),
                    Convert.ToByte(data["a"])
                );
            }
            set
            {
                // if value is set to null, reset the data
                if (value == null)
                {
                    SetData("color", null);
                    return;
                }

                // No data changed
                if (Color != null && Color?.R == value?.R && Color?.G == value?.G && Color?.B == value?.B && Color?.A == value?.A)
                    return;

                Dictionary<string, object> dict = new()
                {
                    { "r", Convert.ToInt32( value?.R ) },
                    { "g", Convert.ToInt32( value?.G ) },
                    { "b", Convert.ToInt32( value?.B ) },
                    { "a", Convert.ToInt32( value?.A ) }
                };

                SetData("color", dict);
            }
        }

        private static List<Marker> markerList = new();

        public static List<Marker> MarkerList
        {
            get
            {
                lock (markerList)
                {
                    return markerList;
                }
            }
            set
            {
                markerList = value;
            }
        }

        public Marker(Vector3 position, int dimension, uint range, ulong entityType) : base(entityType, position, dimension, range)
        {
            EntityType = entityType;
        }

        /// <summary>
        /// Destroy this marker.
        /// </summary>
        public void Destroy()
        {
            Marker.MarkerList.Remove(this);
            AltEntitySync.RemoveEntity(this);
        }
    }

    public static class MarkerStreamer
    {
        /// <summary>
        /// Create a new dynamic marker
        /// </summary>
        /// <param name="markerType">The type of marker to spawn.</param>
        /// <param name="position">The position at which the marker should spawn at.</param>
        /// <param name="scale">The scale of the marker.</param>
        /// <param name="rotation">The rotation of the marker.</param>
        /// <param name="direction">The direction of the marker.</param>
        /// <param name="color">The color of the marker.</param>
        /// <param name="bobUpDown">Whether the marker should bob up and down.</param>
        /// <param name="faceCamera">Whether the marker should face the entity's camera.</param>
        /// <param name="rotate">Whether the marker should rotate on the Y axis only.</param>
        /// <param name="textureDict">An optional texture dictionary to apply to the marker.</param>
        /// <param name="textureName">An optional texture name to apply to the marker.</param>
        /// <param name="drawOnEnter">Whether it should draw the marker onto an entity that intersects with it.</param>
        /// <param name="dimension">The dimension of the marker</param>
        /// <param name="streamRange">Stream distance of the marker, default is 100.</param>
        /// <returns></returns>
        public static Marker Create(
            MarkerTypes markerType, Vector3 position, Vector3 scale, Vector3? rotation = null, Vector3? direction = null, Rgba? color = null, int dimension = 0,
            bool? bobUpDown = false, bool? faceCamera = false, bool? rotate = false, string textureDict = null, string textureName = null,
            bool? drawOnEnter = false, uint streamRange = 100
        )
        {
            Marker marker = new Marker(position, dimension, streamRange, 0)
            {
                Rotation = rotation ?? new Vector3(0),
                MarkerType = markerType,
                Direction = direction ?? new Vector3(0),
                Scale = scale,
                Color = color ?? null,
                BobUpDown = bobUpDown ?? null,
                FaceCamera = faceCamera ?? null,
                Rotate = rotate ?? null,
                TextureDict = textureDict ?? null,
                TextureName = textureName ?? null,
                DrawOnEnter = drawOnEnter ?? null
            };
            Marker.MarkerList.Add(marker);
            AltEntitySync.AddEntity(marker);
            return marker;
        }

        /// <summary>
        /// Destroy a dynamic marker by it's ID.
        /// </summary>
        /// <param name="dynamicMarkerId">The ID of the marker.</param>
        /// <returns>True if successful, false otherwise.</returns>
        public static bool Delete(ulong dynamicMarkerId)
        {
            Marker marker = GetMarker(dynamicMarkerId);

            if (marker == null)
                return false;

            Marker.MarkerList.Remove(marker);
            AltEntitySync.RemoveEntity(marker);
            return true;
        }

        /// <summary>
        /// Destroy a dynamic marker.
        /// </summary>
        /// <param name="marker">The marker instance to destroy.</param>
        public static void Delete(Marker marker)
        {
            Marker.MarkerList.Remove(marker);
            AltEntitySync.RemoveEntity(marker);
        }

        /// <summary>
        /// Get a dynamic marker by it's ID.
        /// </summary>
        /// <param name="dynamicMarkerId">The ID of the marker.</param>
        /// <returns>The dynamic marker or null if not found.</returns>
        public static Marker GetMarker(ulong MarkerId)
        {
            if (!AltEntitySync.TryGetEntity(MarkerId, 0, out IEntity entity))
            {
                Console.WriteLine($"[MARKER-STREAMER] [GetDynamicMarker] ERROR: Entity with ID { MarkerId } couldn't be found.");
                return null;
            }

            if (!(entity is Marker))
                return null;

            return (Marker)entity;
        }

        /// <summary>
        /// Destroy all created dynamic markers.
        /// </summary>
        public static void DestroyAllDynamicMarkers()
        {
            foreach (Marker marker in GetAllDynamicMarkers())
            {
                AltEntitySync.RemoveEntity(marker);
            }
            Marker.MarkerList.Clear();
        }

        /// <summary>
        /// Get all created dynamic markers.
        /// </summary>
        /// <returns>A list of dynamic markers.</returns>
        public static List<Marker> GetAllDynamicMarkers()
        {
            List<Marker> markers = new List<Marker>();

            foreach (IEntity entity in Marker.MarkerList)
            {
                Marker obj = GetMarker(entity.Id);

                if (obj != null)
                    markers.Add(obj);
            }

            return markers;
        }
    }
}