import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'storebackend',
  frameworkVersion: '2',
  plugins: ['serverless-esbuild','serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    lambdaHashingVersion: '20201221',
  },
  functions: { 
    GetUsers:{
      handler: "src/controllers/api/users/users.users",
      events :[{
          http:{
                   path:'users',
                   method:'get',
                   cors:true
         }
      }            
      ]
    },
    CreateUser:{
      handler: "src/controllers/api/users/users.user",
      events :[{
          http:{
                   path:'users',
                   method:'post',
                   cors:true
         }
      }            
      ]
    },
    increaseBalance:{
      handler: "src/controllers/api/users/users.increaseBalance",
      events :[{
          http:{
                   path:'increaseBalance',
                   method:'patch',
                   cors:true,
                   request :{
                     parameters:{
                      querystrings:{
                            userId:true
                      }                        
                     }
                   }
         }
      }            
      ]
    },
    transferMoney:{
      handler: "src/controllers/api/users/users.transferMoney",
      events :[{
          http:{
                   path:'transferMoney',
                   method:'patch',
                   cors:true
         }
      }            
      ]
    },
    getProducts:{
      handler: "src/controllers/api/products/products.getProducts",
      events :[{
          http:{
                   path:'getProducts',
                   method:'get',
                   cors:true
         }
      }            
      ]
    },
    getPurchaseOrder:{
      handler: "src/controllers/api/purchaseOrder/PurchaseOrder.getPurchaseOrder",
      events :[{
          http:{
                   path:'getPurchaseOrder',
                   method:'get',
                   cors:true
         }
      }            
      ]
    },
    CreatePurchaseOrder:{
      handler: "src/controllers/api/purchaseOrder/PurchaseOrder.CreatePurchaseOrder",
      events :[{
          http:{
                   path:'CreatePurchaseOrder',
                   method:'post',
                   cors:true,
                   request :{
                    parameters:{
                     querystrings:{
                           userId:true
                     }                        
                    }
                  }
         }
      }            
      ]
    }

  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
