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
    public class ProductLookup
    {
        public static ProductListing GetProductListing(int id)
        {
            return ProductLookup.GetProductListing(id, null);
        }

        public static ProductListing GetProductListing(string name)
        {
            return ProductLookup.GetProductListing(null, name);
        }

        private static ProductListing GetProductListing(int? id, string name)
        {
            using (var connection = DBConnection.Create())
            {
                connection.Open();
                using (var cmd = new SqlCommand("GetProductListing", connection))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;

                    cmd.Parameters.Add("@id", SqlDbType.Int).Value = id == null ? DBNull.Value : (object)id;
                    cmd.Parameters.Add("@name", SqlDbType.VarChar, 50).Value = name == null ? DBNull.Value : (object)name;

                    using (var reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return new ProductListing()
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

        public static IEnumerable<ProductMatrix> GetProductMatrixes(int productID)
        {
            var c = new List<ProductMatrix>();
            using (var connection = DBConnection.Create())
            {
                connection.Open();
                using (var cmd = new SqlCommand("GetProductMatrixes", connection))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add("@id", SqlDbType.Int).Value = productID;

                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            c.Add(new ProductMatrix()
                            {
                                ID = (int)reader["id"],
                                ColourID = (int)reader["colour"],
                                SizeID = (int)reader["size"],
                                ProductID = (int)reader["product"]
                            });
                        }
                    }
                }
            }
            return c;
        }

        public static IEnumerable<ProductDetails> GetProductDetails(int productID)
        {
            var c = new List<ProductDetails>();
            using (var connection = DBConnection.Create())
            {
                connection.Open();
                using (var cmd = new SqlCommand("GetProductDetails", connection))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add("@id", SqlDbType.Int).Value = productID;
                    
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            c.Add(new ProductDetails()
                            {
                                ID = (int)reader["product"],
                                Name = (string)reader["product_name"],
                                ColourID = (int)reader["colour"],
                                Colour = (string)reader["colour_name"],
                                SizeID = (int)reader["size"],
                                Size = (string)reader["size_name"]
                            });
                        }
                    }
                }
            }

            return c;
        }
    }
}
