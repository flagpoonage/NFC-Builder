using NFCDirectionalTracking.API.Responses;
using NFCDirectionalTracking.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace NFCDirectionalTracking.API
{
    public class LocationsController : ApiController
    {
        public LocationsResponse GetLocationDetails(int id, string qType)
        {
            var response = new LocationsResponse();

            switch(qType)
            {
                case "areas":
                    response.Areas = LocationLookup.GetLocationAreas(id).ToArray();
                    break;
                case "details":
                    response.Details = LocationLookup.GetLocationDetails(id);
                    break;
                default:
                    response.Listing = LocationLookup.GetLocationListing(id);
                    break;
            }

            return response;
        }
    }
}
