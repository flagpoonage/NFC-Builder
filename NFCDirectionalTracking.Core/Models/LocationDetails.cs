using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NFCDirectionalTracking.Core.Models
{
    public class LocationDetails
    {
        public Location Info { get; set; }

        public LocationArea[] Areas { get; set; }
    }
}
