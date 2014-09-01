using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NFCDirectionalTracking.Core
{
    public class DBConnection
    {
        private static string GetConnectionString()
        {
            return ConfigurationManager.ConnectionStrings["DBC"].ConnectionString;
        }

        public static SqlConnection Create()
        {
            var cString = DBConnection.GetConnectionString();
            return new SqlConnection(cString);
        }
    }
}
