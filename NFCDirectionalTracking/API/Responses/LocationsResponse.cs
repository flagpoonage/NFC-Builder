using NFCDirectionalTracking.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace NFCDirectionalTracking.API.Responses
{
    public class LocationsResponse
    {
        public Location Listing { get; set; }

        public LocationArea[] Areas { get; set; }

        public LocationDetails Details { get; set; }
    }
}