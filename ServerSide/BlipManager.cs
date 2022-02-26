using AltV.Net;
using AltV.Net.Async;
using AltV.Net.Data;
using AltV.Net.Elements.Entities;
using AltV.Net.EntitySync;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;

namespace EntityStreamer
{
	/// <summary>
	/// Blip class that stores all data related to a single blip.
	/// </summary>
	public class Blip : AltV.Net.EntitySync.Entity, AltV.Net.EntitySync.IEntity
	{
		/// <summary>
		/// The text to display on the blip in the map menu
		/// </summary>
		public string Name
		{
			get
			{
				if (!TryGetData("name", out string name))
					return null;

				return name;
			}
			set
			{
				SetData("name", value);
			}
		}

		/// <summary>
		/// ID of the sprite to use, can be found on the ALTV wiki
		/// </summary>
		public int Sprite
		{
			get
			{
				if (!TryGetData("sprite", out int spriteId))
					return 0;

				return spriteId;
			}
			set
			{
				SetData("sprite", value);
			}
		}

		/// <summary>
		/// Blip Color code, can also be found on the ALTV wiki
		/// </summary>
		public int Color
		{
			get
			{
				if (!TryGetData("color", out int color))
					return 0;

				return color;
			}
			set
			{
				SetData("color", value);
			}
		}

		/// <summary>
		/// Scale of the blip, 1 is regular size.
		/// </summary>
		public float Scale
		{
			get
			{
				if (!TryGetData("scale", out float scale))
					return 1;

				return scale;
			}
			set
			{
				SetData("scale", value);
			}
		}

		/// <summary>
		/// Whether this blip can be seen on the minimap from anywhere on the map, or only when close to it(it will always show on the main map).
		/// </summary>
		public bool ShortRange
		{
			get
			{
				if (!TryGetData("shortRange", out bool shortRange))
					return true;

				return shortRange;
			}
			set
			{
				SetData("shortRange", value);
			}
		}

		public Blip(Vector3 position, int dimension, uint range, ulong entityType) : base(entityType, position, dimension, range)
		{
		}		

		public bool IsStaticBlip { get; set; }

		/// <summary>
		/// Destroy this blip.
		/// </summary>
		public void Delete()
		{
			AltEntitySync.RemoveEntity(this);
		}

		public void SetPosition(Position pos)
		{
			this.Position = pos;
		}

		public void SetBlipType(int type)
		{
			//TODO Transformer in runtime un blip static en dynamique et inversement.
		}
	}

	public static class BlipStreamer
	{
		public static Dictionary<ulong, Blip> BlipList = new();

		/// <summary>
		/// Create static blip without any range limit
		/// </summary>
		/// <param name="name"></param>
		/// <param name="color"></param>
		/// <param name="scale"></param>
		/// <param name="shortRange"></param>
		/// <param name="spriteId"></param>
		/// <param name="position"></param>
		/// <param name="dimension"></param>
		/// <param name="range"></param>
		/// <returns></returns>
		public static Blip CreateStaticBlip(string name, int color, float scale, bool shortRange, int spriteId, Vector3 position, int dimension = 0, uint range = 100)
		{
			Blip blip = new Blip(position, dimension, range, 4)
			{
				Color = color,
				Scale = scale,
				ShortRange = shortRange,
				Sprite = spriteId,
				Name = name,
				IsStaticBlip = true
			};
			AltEntitySync.AddEntity(blip);
			BlipList.Add(blip.Id, blip);
			return blip;
		}

		/// <summary>
		/// Create Dynamic Blip.
		/// </summary>
		/// <param name="name"></param>
		/// <param name="color"></param>
		/// <param name="scale"></param>
		/// <param name="shortRange"></param>
		/// <param name="spriteId"></param>
		/// <param name="position"></param>
		/// <param name="dimension"></param>
		/// <param name="range"></param>
		/// <returns></returns>
		public static Blip CreateDynamicBlip(string name, int color, float scale, bool shortRange, int spriteId, Vector3 position, int dimension = 0, uint range = 200)
		{
			Blip blip = new Blip(position, dimension, range, 5)
			{
				Color = color,
				Scale = scale,
				ShortRange = shortRange,
				Sprite = spriteId,
				Name = name,
				IsStaticBlip = false,
			};
			AltEntitySync.AddEntity(blip);
			BlipList.Add(blip.Id, blip);
			return blip;
		}

		/// <summary>
		/// Destroy a dynamic blip
		/// </summary>
		/// <param name="blip">The blip to destroy</param>
		public static void DestroyBlip(Blip blip)
		{
			BlipList.Remove(blip.Id);
			AltEntitySync.RemoveEntity(blip);
		}

		public static Blip GetBlip(ulong dynamicObjectId)
		{

			return BlipList[dynamicObjectId];
		}

		public static List<Blip> GetAllBlip()
		{
			List<Blip> objects = new List<Blip>();

			foreach (KeyValuePair<ulong, Blip> entity in BlipStreamer.BlipList)
			{
				Blip obj = GetBlip(entity.Key);

				if (obj != null)
					objects.Add(obj);
			}

			return objects;
		}

		public static (Blip obj, float distance) GetClosestBlip(Vector3 pos)
		{
			if (GetAllBlip().Count == 0)
				return (null, 5000);

			Blip obj = null;
			float distance = 5000;

			foreach (Blip o in GetAllBlip())
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

