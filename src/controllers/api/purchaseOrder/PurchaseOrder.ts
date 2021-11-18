import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import { prisma } from "../../../shared";
var uuid = require("uuid");

export const getPurchaseOrder: APIGatewayProxyHandler = async (
  event,
  _context
) => {
  const purchaseOrder = await prisma.purchaseOrders.findMany();
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        purchaseOrder,
      },
      null,
      2
    ),
  };
};

export const CreatePurchaseOrder: APIGatewayProxyHandler = async (
  event,
  _context
) => {
  const { userId } = event.queryStringParameters;
  const { products } = JSON.parse(event.body);
  let totalPrice = 0;
  let ListPurchaseOrderItems = [];

  const user = await prisma.client.findMany({
    where: {
      id: Number(userId),
    },
  });

  for (let i = 0; i < products.length; i++) {
    const product = await prisma.product.findMany({
      where: {
        id: products[i].id,
      },
    });
    let partialPurchaseOrderItems = {
      ProductId: product[0].id,
      Quantity: products[i].quantity,
      Total: product[0].price * products[i].quantity,
    };
    ListPurchaseOrderItems.push(partialPurchaseOrderItems);

    totalPrice = totalPrice + product[0].price * products[i].quantity;
  }
  if (totalPrice > user[0].balance) {
    return {
      statusCode: 409,
      body: JSON.stringify(
        {
          successful: false,
          error: `El usuario ${user[0].name} no tiene saldo suficiente para comprar`,
          reference: uuid.v1(),
        },
        null,
        2
      ),
    };
  } else {
    const purchaseOrder = await prisma.purchaseOrders.create({
      data: {
        userId: Number(userId),
        totalPrice: Number(totalPrice),
        creationDate: new Date(),
      },
    });
    for (let i = 0; i < ListPurchaseOrderItems.length; i++) {
      await prisma.purchaseOrderItems.create({
        data: {
          purchaseOrderId: purchaseOrder.id,
          productId: ListPurchaseOrderItems[i].ProductId,
          quantity: ListPurchaseOrderItems[i].Quantity,
          total: ListPurchaseOrderItems[i].Total,
        },
      });
    }

    await prisma.client.updateMany({
      where: {
        id: Number(userId),
      },
      data: {
        balance: user[0].balance - totalPrice,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          successful: true,
          purchaseOrderId: purchaseOrder.id,
          TotalPrice: totalPrice,
        },
        null,
        2
      ),
    };
  }
};
