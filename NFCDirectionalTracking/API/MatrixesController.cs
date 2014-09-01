using NFCDirectionalTracking.Core;
using NFCDirectionalTracking.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace NFCDirectionalTracking.API
{
    public class MatrixesController : ApiController
    {
        public ProductDetails GetMatrixProductDetails(int id)
        {
            return MatrixLookup.GetProductMatrixDetails(id);
        }

        public ProductDetails GetMatrixProductDetails(int productId, int sizeId, int colourId)
        {
            return MatrixLookup.GetProductMatrixDetails(productId, sizeId, colourId);
        }
    }
}