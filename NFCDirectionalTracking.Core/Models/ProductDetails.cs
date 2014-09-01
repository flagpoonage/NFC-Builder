using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NFCDirectionalTracking.Core.Models
{
    public class ProductDetails : ProductListing
    {
        public int ColourID { get; set; }

        public string Colour { get; set; }

        public int SizeID { get; set; }

        public string Size { get; set; }
    }
}
