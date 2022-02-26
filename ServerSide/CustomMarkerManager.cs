using AltV.Net.EntitySync;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;

namespace AfterDark.Core.EntitySync.EntityStreamer
{
    public enum MarkerOrientations
    {
        ARROW_ON_TOP = 1,
        ARROW_ON_LEFT = 2,
        ARROW_ON_BOTTOM = 3,
        ARROW_ON_RIGHT = 4,
    }

    public class CustomMarker : Entity, IEntity
    {
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

        public int BackgroundColor
        {
            get
            {
                if (!TryGetData("background", out int background))
                    return 0;

                return background;
            }
            set
            {
                SetData("background", value);
            }
        }

        public MarkerOrientations MarkerOrientation
        {
            get
            {
                if (!TryGetData("markerOrientation", out int markerType))
                    return default;

                return (MarkerOrientations)markerType;
            }
            set
            {
                // No data changed
                if (MarkerOrientation == value)
                    return;

                SetData("markerOrientation", (int)value);
            }
        }

        public static object customMarkerLockHandle = new();
        private static List<CustomMarker> customMarkerList = new();
        public static List<CustomMarker> CustomMarkerList
        {
            get
            {
                lock (customMarkerLockHandle)
                {
                    return customMarkerList;
                }
            }
            set
            {
                customMarkerList = value;
            }
        }

        public CustomMarker(Vector3 position, int dimension, uint range, ulong entityType) : base(entityType, position, dimension, range)
        {
        }

        public void Delete()
        {
            CustomMarker.customMarkerList.Remove(this);
            AltEntitySync.RemoveEntity(this);
        }

        public void SetText(string text)
        {
            Text = text;
        }
    }

    public static class CustomMarkerStreamer
    {
        public static CustomMarker Create(string text, int backgroundColor, Vector3 position, MarkerOrientations orientation, int dimension = 0, uint streamRange = 5)
        {
            CustomMarker marker = new(position, dimension, streamRange, 9)
            {
                Text = text,
                BackgroundColor = backgroundColor,
                MarkerOrientation = orientation,
            };
            CustomMarker.CustomMarkerList.Add(marker);
            AltEntitySync.AddEntity(marker);
            return marker;
        }

        public static bool DeleteCustomMarker(ulong dynamicMarkerId)
        {
            CustomMarker obj = GetCustomMarker(dynamicMarkerId);

            if (obj == null)
                return false;

            CustomMarker.CustomMarkerList.Remove(obj);
            AltEntitySync.RemoveEntity(obj);
            return true;
        }

        public static void DeleteCustomMarker(CustomMarker dynamicMarker)
        {
            CustomMarker.CustomMarkerList.Remove(dynamicMarker);
            AltEntitySync.RemoveEntity(dynamicMarker);
        }

        public static CustomMarker GetCustomMarker(ulong dynamicMarkerId)
        {
            if (!AltEntitySync.TryGetEntity(dynamicMarkerId, 9, out IEntity entity))
            {
                Console.WriteLine($"[OBJECT-STREAMER] [GetDynamicTextLabel] ERROR: Entity with ID { dynamicMarkerId } couldn't be found.");
                return null;
            }

            return (CustomMarker)entity;
        }

        public static void DeleteAllCustomMarker()
        {
            foreach (CustomMarker obj in GetAllMarker())
            {
                CustomMarker.CustomMarkerList.Remove(obj);
                AltEntitySync.RemoveEntity(obj);
            }
        }

        public static List<CustomMarker> GetAllMarker()
        {
            List<CustomMarker> textLabels = new();

            foreach (IEntity entity in CustomMarker.CustomMarkerList)
            {
                CustomMarker textLabel = GetCustomMarker(entity.Id);

                if (textLabel != null)
                    textLabels.Add(textLabel);
            }

            return textLabels;
        }

    }
}
