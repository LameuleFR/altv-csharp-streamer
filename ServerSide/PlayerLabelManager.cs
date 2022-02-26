using AltV.Net.Data;
using AltV.Net.EntitySync;
using System;
using System.Collections.Generic;
using System.Numerics;

namespace EntityStreamer
{
    /// <summary>
    /// Class to hold drop shadow data.
    /// </summary>
    public class DropShadow
    {
        public int Distance { get; set; }
        public int R { get; set; }
        public int G { get; set; }
        public int B { get; set; }
        public int A { get; set; }
    }

    /// <summary>
    /// DynamicTextLabel class that stores all data related to a single textlabel
    /// </summary>
    public class PlayerLabel : Entity, IEntity
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
        /// Set/get or get the current textlabel's scale.
        /// </summary>
        public float? Scale
        {
            get
            {
                if (!TryGetData("scale", out float scale))
                    return null;

                return scale;
            }
            set
            {
                SetData("scale", value);
            }
        }

        /// <summary>
        /// Set/get the textlabel's text.
        /// </summary>
        public string Text
        {
            get
            {
                if (!TryGetData("text", out string text))
                    return null;

                return text;
            }
            set
            {
                SetData("text", value);
            }
        }

        /// <summary>
        /// Set/get textlabel center, if true the textlabel will be centered.
        /// </summary>
        public bool Center
        {
            get
            {
                if (!TryGetData("center", out bool center))
                    return default;

                return center;
            }
            set
            {
                SetData("center", value);
            }
        }

        /// <summary>
        /// Set/get textlabel proportional.
        /// </summary>
        public bool Proportional
        {
            get
            {
                if (!TryGetData("proportional", out bool proportional))
                    return default;

                return proportional;
            }
            set
            {
                SetData("proportional", value);
            }
        }

        /// <summary>
        /// Set/get textlabel's color.
        /// </summary>
        public Rgba Color
        {
            get
            {
                if (!TryGetData("color", out Dictionary<string, object> data))
                    return default;

                return new Rgba()
                {
                    R = Convert.ToByte(data["r"]),
                    G = Convert.ToByte(data["g"]),
                    B = Convert.ToByte(data["b"]),
                    A = Convert.ToByte(data["a"]),
                };
            }
            set
            {
                // No data changed
                if (Color.R == value.R && Color.G == value.G && Color.B == value.B && Color.A == value.A)
                    return;

                Dictionary<string, object> dict = new()
                {
                    ["r"] = Convert.ToInt32(value.R),
                    ["g"] = Convert.ToInt32(value.G),
                    ["b"] = Convert.ToInt32(value.B),
                    ["a"] = Convert.ToInt32(value.A),
                };
                SetData("color", dict);
            }
        }

        /// <summary>
        /// Set/get textlabel's edge color.
        /// </summary>
        public Rgba Edge
        {
            get
            {
                if (!TryGetData("edge", out Dictionary<string, object> data))
                    return default;

                return new Rgba()
                {
                    R = Convert.ToByte(data["r"]),
                    G = Convert.ToByte(data["g"]),
                    B = Convert.ToByte(data["b"]),
                    A = Convert.ToByte(data["a"]),
                };
            }
            set
            {
                // No data changed
                if (Edge.R == value.R && Edge.G == value.G && Edge.B == value.B && Edge.A == value.A)
                    return;

                Dictionary<string, object> dict = new()
                {
                    ["r"] = Convert.ToInt32(value.R),
                    ["g"] = Convert.ToInt32(value.G),
                    ["b"] = Convert.ToInt32(value.B),
                    ["a"] = Convert.ToInt32(value.A),
                };
                SetData("edge", dict);
            }
        }

        /// <summary>
        /// Set/get textlabel's drop shadow.
        /// </summary>
        public DropShadow DropShadow
        {
            get
            {
                if (!TryGetData("dropShadow", out Dictionary<string, object> data))
                    return null;

                return new DropShadow()
                {
                    Distance = Convert.ToInt32(data["distance"]),
                    R = Convert.ToInt32(data["r"]),
                    G = Convert.ToInt32(data["g"]),
                    B = Convert.ToInt32(data["b"]),
                    A = Convert.ToInt32(data["a"]),
                };
            }
            set
            {
                // No data changed
                if (DropShadow.Distance == value.Distance && DropShadow.R == value.R && DropShadow.G == value.G && DropShadow.B == value.B && DropShadow.A == value.A)
                    return;

                Dictionary<string, object> dict = new()
                {
                    ["distance"] = value.Distance,
                    ["r"] = value.R,
                    ["g"] = value.G,
                    ["b"] = value.B,
                    ["a"] = value.A,
                };
                SetData("dropShadow", dict);
            }
        }

        /// <summary>
        /// Set/get textlabel's font type.
        /// </summary>
        public int Font
        {
            get
            {
                if (!TryGetData("font", out int font))
                    return default;

                return font;
            }
            set
            {
                SetData("font", value);
            }
        }

        public static object LabelLockHandle = new();

        private static List<PlayerLabel> labelList = new();

        public static List<PlayerLabel> LabelList
        {
            get
            {
                lock (LabelLockHandle)
                {
                    return labelList;
                }
            }
            set
            {
                labelList = value;
            }
        }

        public PlayerLabel(Vector3 position, int dimension, uint range, ulong entityType) : base(entityType, position, dimension, range)
        {
            EntityType = entityType;
        }

        /// <summary>
        /// Destroy this textlabel.
        /// </summary>
        public void Delete()
        {
            PlayerLabel.LabelList.Remove(this);
            AltEntitySync.RemoveEntity(this);
        }

        public void SetText(string text)
        {
            Text = text;
        }
    }

    public static class TextLabelStreamer
    {
        /// <summary>
        /// Create a new dynamic textlabel.
        /// </summary>
        /// <param name="text">The text to be displayed.</param>
        /// <param name="position">The position to spawn it at.</param>
        /// <param name="dimension">The dimension to spawn it in.</param>
        /// <param name="center">Center the textlabel.</param>
        /// <param name="color">The color of the textlabel.</param>
        /// <param name="scale">The scale of the textlabel.</param>
        /// <param name="dropShadow">The drop shadow of the textlabel.</param>
        /// <param name="edge">The edge color of the textlabel.</param>
        /// <param name="font">The font type of the textlabel.</param>
        /// <param name="proportional">Whether to set textlabel proportional.</param>
        /// <param name="streamRange">Stream range, default is 30.</param>
        /// <returns>The newly created dynamic textlabel.</returns>
        public static PlayerLabel Create(
            string text, Vector3 position, int dimension = 0, bool? center = true, Rgba? color = null, float? scale = 0.7f,
            DropShadow dropShadow = null, Rgba? edge = null, int? font = null, bool? proportional = null, uint streamRange = 45
        )
        {
            PlayerLabel textLabel = new PlayerLabel(position, dimension, streamRange, 1)
            {
                Center = center ?? true,
                Color = color ?? new Rgba(255, 255, 255, 255),
                DropShadow = dropShadow ?? new DropShadow { Distance = 0, R = 0, G = 0, B = 0, A = 255 },
                Edge = edge ?? new Rgba(0, 0, 0, 150),
                Font = font ?? 4,
                Text = text,
                Proportional = proportional ?? true,
                Scale = scale
            };
            PlayerLabel.LabelList.Add(textLabel);
            AltEntitySync.AddEntity(textLabel);
            return textLabel;
        }

        /// <summary>
        /// Destroy a dynamic text label by it's ID.
        /// </summary>
        /// <param name="dynamicTextLabelId">The ID of the text label.</param>
        /// <returns>True if successful, false otherwise.</returns>
        public static bool DestroyDynamicTextLabel(ulong dynamicTextLabelId)
        {
            PlayerLabel obj = GetDynamicTextLabel(dynamicTextLabelId);

            if (obj == null)
                return false;

            PlayerLabel.LabelList.Remove(obj);
            AltEntitySync.RemoveEntity(obj);
            return true;
        }

        /// <summary>
        /// Destroy a dynamic text label.
        /// </summary>
        /// <param name="dynamicTextLabel">The text label instance to destroy.</param>
        public static void DestroyDynamicTextLabel(PlayerLabel dynamicTextLabel)
        {
            PlayerLabel.LabelList.Remove(dynamicTextLabel);
            AltEntitySync.RemoveEntity(dynamicTextLabel);
        }

        /// <summary>
        /// Get a dynamic text label by it's ID.
        /// </summary>
        /// <param name="dynamicTextLabelId">The ID of the textlabel.</param>
        /// <returns>The dynamic textlabel or null if not found.</returns>
        public static PlayerLabel GetDynamicTextLabel(ulong dynamicTextLabelId)
        {
            if (!AltEntitySync.TryGetEntity(dynamicTextLabelId, 1, out IEntity entity))
            {
                Console.WriteLine($"[OBJECT-STREAMER] [GetDynamicTextLabel] ERROR: Entity with ID { dynamicTextLabelId } couldn't be found.");
                return null;
            }

            return (PlayerLabel)entity;
        }

        /// <summary>
        /// Destroy all created dynamic textlabels.
        /// </summary>
        public static void DestroyAllDynamicTextLabels()
        {
            foreach (PlayerLabel obj in GetAllDynamicTextLabels())
            {
                AltEntitySync.RemoveEntity(obj);
            }
            PlayerLabel.LabelList.Clear();
        }

        /// <summary>
        /// Get all created dynamic textlabels.
        /// </summary>
        /// <returns>A list of dynamic textlabels.</returns>
        public static List<PlayerLabel> GetAllDynamicTextLabels()
        {
            List<PlayerLabel> textLabels = new List<PlayerLabel>();

            foreach (IEntity entity in PlayerLabel.LabelList)
            {
                PlayerLabel textLabel = GetDynamicTextLabel(entity.Id);

                if (textLabel != null)
                    textLabels.Add(textLabel);
            }

            return textLabels;
        }
    }
}