using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NFCDirectionalTracking.Core.Models
{
    public class ProductInstance : ProductDetails
    {
        public int LocationID { get; set; }

        public string Location { get; set; }

        public int AreaID { get; set; }

        public string AreaName { get; set; }

        public int StockLevel { get; set; }
    }
}
