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
    public class MatrixLookup
    {

        public static ProductDetails GetProductMatrixDetails(int matrixID)
        {
            using (var connection = DBConnection.Create())
            {
                connection.Open();
                using (var cmd = new SqlCommand("GetDirectProductMatrixDetails", connection))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add("@id", SqlDbType.Int).Value = matrixID;

                    using (var reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return new ProductDetails()
                            {
                                ID = (int)reader["product"],
                                Name = (string)reader["product_name"],
                                ColourID = (int)reader["colour"],
                                Colour = (string)reader["colour_name"],
                                SizeID = (int)reader["size"],
                                Size = (string)reader["size_name"]
                            };
                        }
                    }
                }
            }

            return null;
        }

        public static ProductDetails GetProductMatrixDetails(int productID, int sizeId, int colourId)
        {
            using (var connection = DBConnection.Create())
            {
                connection.Open();
                using (var cmd = new SqlCommand("GetProductMatrixDetails", connection))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add("@productId", SqlDbType.Int).Value = productID;
                    cmd.Parameters.Add("@sizeId", SqlDbType.Int).Value = sizeId;
                    cmd.Parameters.Add("@colourId", SqlDbType.Int).Value = colourId;

                    using (var reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return new ProductDetails()
                            {
                                ID = (int)reader["product"],
                                Name = (string)reader["product_name"],
                                ColourID = (int)reader["colour"],
                                Colour = (string)reader["colour_name"],
                                SizeID = (int)reader["size"],
                                Size = (string)reader["size_name"]
                            };
                        }
                    }
                }
            }

            return null;
        }
    }
}
