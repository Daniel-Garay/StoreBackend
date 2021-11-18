import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import { prisma } from "../../../shared";
var uuid = require("uuid");

export const getPurchaseOrder: APIGatewayProxyHandler = async (
  event,
  _context
) => {
  const purchaseOrder = await prisma.purchaseOrder.findMany();
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

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  for (let i = 0; i < products.length; i++) {
    const product = await prisma.product.findUnique({
      where: {
        id: products[i].id,
      },
    });
    let partialPurchaseOrderItems = {
      ProductId: product.id,
      Quantity: products[i].quantity,
      Total: product.Price * products[i].quantity,
    };
    ListPurchaseOrderItems.push(partialPurchaseOrderItems);

    totalPrice = totalPrice + product.Price * products[i].quantity;
  }
  if (totalPrice > user.balance) {
    return {
      statusCode: 409,
      body: JSON.stringify(
        {
          successful: false,
          error: `El usuario ${user.Name} no tiene saldo suficiente para comprar`,
          reference: uuid.v1(),
        },
        null,
        2
      ),
    };
  } else {
    const purchaseOrder = await prisma.purchaseOrder.create({
      data: {
        UserId: userId,
        TotalPrice: totalPrice,
      },
    });
    for (let i = 0; i < ListPurchaseOrderItems.length; i++) {
      await prisma.purchaseOrderItems.create({
        data: {
          PurchaseOrderId: purchaseOrder.id,
          ProductId: ListPurchaseOrderItems[i].ProductId,
          Quantity: ListPurchaseOrderItems[i].Quantity,
          Total: ListPurchaseOrderItems[i].Total,
        },
      });
    }

    await prisma.user.updateMany({
      where: {
        id: userId,
      },
      data: {
        balance: user.balance - totalPrice,
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
