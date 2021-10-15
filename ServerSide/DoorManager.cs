using AltV.Net;
using AltV.Net.EntitySync;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Numerics;

namespace EntityStreamer
{
    /// <summary>
    /// DynamicObject class that stores all data related to a single object
    /// </summary>
    public class NetworkDoor : Entity, IEntity
    {
        /// <summary>
        /// Set or get the current door hash.
        /// </summary>
        public uint Hash
        {
            get
            {
                if (!TryGetData("hash", out uint hash))
                    return 0;

                return hash;
            }
            set
            {
                if (Hash == value)
                    return;

                SetData("hash", value);
            }
        }        
        
        public float Heading
        {
            get
            {
                if (!TryGetData("heading", out float heading))
                    return 0;

                return heading;
            }
            set
            {
                if (Math.Abs(Heading - value) < float.Epsilon)
                    return;

                SetData("heading", value);
            }
        }

        /// <summary>
        /// Set the lock statut of the door
        /// </summary>
        public bool? Locked
        {
            get
            {
                if (!TryGetData("locked", out bool locked))
                    return false;

                return locked;
            }
            set
            {
                if (value == null)
                {
                    SetData("locked", null);
                    return;
                }
                if (Locked == value)
                    return;

                SetData("locked", value);
            }
        }

        public NetworkDoor(Vector3 position, int dimension, uint range, ulong entityType) : base(entityType, position, dimension, range)
        {
        }

        public void Delete()
        {
            DoorStreamer.DoorList.TryRemove(this.Id, out NetworkDoor value);
            AltEntitySync.RemoveEntity(this);
        }

        public void Destroy()
        {
            DoorStreamer.DoorList.TryRemove(this.Id, out NetworkDoor value);
            AltEntitySync.RemoveEntity(this);
        }
    }

    public class DoorStreamer
    {
        public static ConcurrentDictionary<ulong, NetworkDoor> DoorList = new ConcurrentDictionary<ulong, NetworkDoor>();

        public static NetworkDoor Create(
            uint hash, Vector3 position, float heading ,bool locked, uint streamRange = 25
        )
        {
            NetworkDoor obj = new NetworkDoor(position, 0, streamRange, 6)
            {
                Hash = hash,
                Locked = locked,
                Heading = heading,
            };
            AltEntitySync.AddEntity(obj);
            DoorList.TryAdd(obj.Id, obj);
            return obj;
        }

        public static bool Delete(ulong dynamicObjectId)
        {
            NetworkDoor obj = GetDoor(dynamicObjectId);

            if (obj == null)
                return false;
            DoorList.TryRemove(obj.Id, out NetworkDoor value);
            AltEntitySync.RemoveEntity(obj);
            return true;
        }

        public static void Delete(NetworkDoor obj)
        {
            DoorList.TryRemove(obj.Id, out NetworkDoor value);
            AltEntitySync.RemoveEntity(obj);
        }

        public static NetworkDoor GetDoor(ulong dynamicObjectId)
        {
            return DoorList[dynamicObjectId];
        }

        public static List<NetworkDoor> GetAllDoors()
        {
            List<NetworkDoor> objects = new List<NetworkDoor>();

            foreach (KeyValuePair<ulong, NetworkDoor> entity in DoorList)
            {
                objects.Add(entity.Value);
            }

            return objects;
        }

        public static (NetworkDoor obj, float distance) GetClosestDoor(Vector3 pos)
        {
            if (GetAllDoors().Count == 0)
                return (null, 5000);

            NetworkDoor obj = null;
            float distance = 5000;

            foreach (NetworkDoor o in GetAllDoors())
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
