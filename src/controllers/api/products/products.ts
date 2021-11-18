import {APIGatewayProxyHandler} from 'aws-lambda'
import  'source-map-support/register'
import { prisma } from '../../../shared';

export const getProducts: APIGatewayProxyHandler = async(event, _context) =>{
  const products = await prisma.product.findMany()
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        products,
      },
      null,
      2
    ),
  };
}