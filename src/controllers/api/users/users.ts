import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import { prisma } from "../../../shared";
import { IUser } from "src/interfaces/IUser";
var uuid = require("uuid");

export const users: APIGatewayProxyHandler = async (event, _context) => {
  const users = (await prisma.user.findMany()) as IUser;
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        users,
      },
      null,
      2
    ),
  };
};
export const user: APIGatewayProxyHandler = async (event, _context) => {
  const requestBody = JSON.parse(event.body) as IUser;
  const userFilter = await prisma.user.findMany({
    where: {
      Email: requestBody.Email,
    },
  });
  if (userFilter.length > 0) {
    return {
      statusCode: 409,
      body: JSON.stringify(
        {
          successful: false,
          error: "El correo ya se registro previmanete",
          reference: uuid.v1(),
        },
        null,
        2
      ),
    };
  }

  const user = await prisma.user.create({
    data: requestBody,
  });
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        id: user.id,
      },
      null,
      2
    ),
  };
};

export const increaseBalance: APIGatewayProxyHandler = async (
  event,
  _context
) => {
  const { userId } = event.queryStringParameters;
  const requestBody = JSON.parse(event.body);
  const userFilter = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (userFilter.length < 1) {
    return {
      statusCode: 409,
      body: JSON.stringify(
        {
          successful: false,
          error: "El usuario que dese actualizar no existe",
          reference: uuid.v1(),
        },
        null,
        2
      ),
    };
  } else {
    await prisma.user.updateMany({
      where: {
        id: userId,
      },
      data: {
        balance: requestBody.balance + userFilter.balance,
      },
    });
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          successful: true,
          error: "El balance se actualizo correctamente",
        },
        null,
        2
      ),
    };
  }
};

export const transferMoney: APIGatewayProxyHandler = async (
  event,
  _context
) => {
  const requestBody = JSON.parse(event.body);
  const debitUserDB = await prisma.user.findUnique({
    where: {
      id: requestBody.debitUser,
    },
  });

  const userToTransferDB = await prisma.user.findUnique({
    where: {
      id: requestBody.userToTransfer,
    },
  });

  if (
    debitUserDB === null ||
    debitUserDB === undefined ||
    userToTransferDB === null ||
    userToTransferDB === undefined
  ) {
    return {
      statusCode: 409,
      body: JSON.stringify(
        {
          successful: false,
          error: "Los parametros no dan respuesta",
          reference: uuid.v1(),
        },
        null,
        2
      ),
    };
  } else {
    if (debitUserDB.balance < requestBody.amountToTransfer) {
      return {
        statusCode: 409,
        body: JSON.stringify(
          {
            successful: false,
            error: `El usuario ${debitUserDB.Name} no tiene saldo suficiente para transferir`,
            reference: uuid.v1(),
          },
          null,
          2
        ),
      };
    } else {
      await prisma.user.updateMany({
        where: {
          id: debitUserDB.id,
        },
        data: {
          balance: debitUserDB.balance - requestBody.amountToTransfer,
        },
      });
      await prisma.user.updateMany({
        where: {
          id: userToTransferDB.id,
        },
        data: {
          balance: userToTransferDB.balance + requestBody.amountToTransfer,
        },
      });

      return {
        statusCode: 200,
        body: JSON.stringify(
          {
            successful: true,
            error: "El balance se actualizo correctamente",
          },
          null,
          2
        ),
      };
    }
  }
};
