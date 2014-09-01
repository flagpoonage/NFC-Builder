using NFCDirectionalTracking.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace NFCDirectionalTracking.API.Responses
{
    public class ProductsResponse
    {
        public ProductListing Listing { get; set; }

        public ProductMatrix[] Matrixes { get; set; }

        public ProductDetails[] Details { get; set; }
    }
}