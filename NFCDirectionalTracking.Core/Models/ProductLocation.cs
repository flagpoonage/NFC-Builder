using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NFCDirectionalTracking.Core.Models
{
    public class ProductLocation
    {
        public int ProductMatrix { get; set; }

        public int AreaID { get; set; }

        public int LocationID { get; set; }

        public int StockLevel { get; set; }
    }
}
