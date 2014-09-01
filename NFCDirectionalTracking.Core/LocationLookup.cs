using NFCDirectionalTracking.Core.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NFCDirectionalTracking.Core
{
    public class LocationLookup
    {
        public static Location GetLocationListing(int id)
        {
            return LocationLookup.GetLocationListing(id, null);
        }

        public static Location GetLocationListing(string name)
        {
            return LocationLookup.GetLocationListing(null, name);
        }

        private static Location GetLocationListing(int? id, string name)
        {
            using (var connection = DBConnection.Create())
            {
                connection.Open();
                using (var cmd = new SqlCommand("GetLocationListing", connection))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;

                    cmd.Parameters.Add("@id", SqlDbType.Int).Value = id == null ? DBNull.Value : (object)id;
                    cmd.Parameters.Add("@name", SqlDbType.VarChar, 50).Value = name == null ? DBNull.Value : (object)name;

                    using (var reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return new Location()
                            {
                                ID = (int)reader["id"],
                                Name = (string)reader["name"]
                            };
                        }
                    }
                }
            }

            return null;
        }
        public static IEnumerable<LocationArea> GetLocationAreas(int id)
        {
            var c = new List<LocationArea>();
            using (var connection = DBConnection.Create())
            {
                connection.Open();
                using (var cmd = new SqlCommand("GetLocationListing", connection))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;

                    cmd.Parameters.Add("@id", SqlDbType.Int).Value = id;

                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            c.Add(new LocationArea()
                            {
                                ID = (int)reader["id"],
                                LocationID = (int)reader["location"],
                                Name = (string)reader["name"]
                            });
                        }
                    }
                }
            }

            return c;
        }
        
        public static LocationDetails GetLocationDetails(int id)
        {
            Location res = null;
            var c = new List<LocationArea>();
            
            using (var connection = DBConnection.Create())
            {
                connection.Open();
                using (var cmd = new SqlCommand("GetLocationListing", connection))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;

                    cmd.Parameters.Add("@id", SqlDbType.Int).Value = id;

                    using (var reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            res = new Location()
                            {
                                ID = (int)reader["id"],
                                Name = (string)reader["name"]
                            };
                        }
                    }
                }

                if(res == null)
                {
                    return null;
                }

                using (var cmd = new SqlCommand("GetLocationListing", connection))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;

                    cmd.Parameters.Add("@id", SqlDbType.Int).Value = id;

                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            c.Add(new LocationArea()
                            {
                                ID = (int)reader["id"],
                                LocationID = (int)reader["location"],
                                Name = (string)reader["name"]
                            });
                        }
                    }
                }                
            }

            return new LocationDetails()
            {
                Areas = c.ToArray(),
                Info = res
            };
        }
    }

}
