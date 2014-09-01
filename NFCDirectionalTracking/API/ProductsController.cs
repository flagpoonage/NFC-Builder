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
    public class ProductsController : ApiController
    {
        public ProductsResponse GetProductDetails(int id, string qType)
        {
            var response = new ProductsResponse();
            switch(qType)
            {
                case "matrixes":
                    response.Matrixes = ProductLookup.GetProductMatrixes(id).ToArray();
                    break;
                case "details":
                    response.Details = ProductLookup.GetProductDetails(id).ToArray();
                    break;
                default:
                    response.Listing  = ProductLookup.GetProductListing(id);
                    break;
            }

            return response;
        }
    }
}
