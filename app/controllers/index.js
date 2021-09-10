const moment = require("moment-timezone");
const ProductsDao = require("../dao/ProductsDao");
const connFactory = require("../conectionFactory");
const statusCode = require("../constants/statusCode");
const { getExchange } = require("../services");
const { calculateExchange } = require("../helpers");
const { messages } = require("../constants/messages");

const getProducts = async (req, res, next) => {
  /* 
     #swagger.tags = ['Products']
     #swagger.description = 'Fetch all products'
     #swagger.responses[200] = {
               schema: { $ref: "#/definitions/ProductResponse" },
               description: 'Products fetched' 
    }
    #swagger.responses[500] = { 
        schema: { error: true, message: 'Ocorreu um erro em nossos sistemas. Tente novamente mais tarde.' },
        description: 'Internal error' 
    }
    */
  try {
    const conn = await connFactory();
    const productsDao = new ProductsDao(conn);

    const [rows] = await productsDao.getAll();

    const { data } = await getExchange();

    const products = Object.values(JSON.parse(JSON.stringify(rows)));

    await products.map((product) => {
      const result = calculateExchange(data, product.value);

      product.currencies = result;
    });

    conn.end();

    return res.status(statusCode.Success).json(products);
  } catch (error) {
    next(error);
  }
};

const getProductsById = async (req, res, next) => {
  /* 
     #swagger.tags = ['Products']
     #swagger.description = 'Get a product by its id'
     #swagger.parameters['id'] = { description: 'Product Id'}

     #swagger.responses[200] = { 
               schema: { $ref: "#/definitions/ProductResponse" },
               description: 'Product found' 
    }
     #swagger.responses[404] = { 
               schema: { message: 'Produto não encontrado'},
               description: 'Product not found' 
    }
    #swagger.responses[500] = { 
        schema: { error: true, message: 'Ocorreu um erro em nossos sistemas. Tente novamente mais tarde.' },
        description: 'Internal error' 
    }
    */

  try {
    const {
      params: { id },
    } = req;

    const conn = await connFactory();
    const productsDao = new ProductsDao(conn);

    const [rows] = await productsDao.getById(id);

    if (rows.length > 0) {
      const { data } = await getExchange();

      const _rows = Object.values(JSON.parse(JSON.stringify(rows)));

      const product = Object.assign(..._rows);

      const result = await calculateExchange(data, product.value);

      product.currencies = result;

      return res.status(statusCode.Success).json(product);
    }
    conn.end();

    return res
      .status(statusCode.NotFound)
      .json({ message: messages.productNotFound });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  /* 
    #swagger.tags = ['Products']
    #swagger.description = 'Create a product passing the values contained on the models'
    #swagger.parameters['body'] = {
               in: 'body',
               description: 'Products information.',
               required: true,
               type: 'object',
               schema: { $ref: "#/definitions/ProductBody" }
    }
    #swagger.responses[201] = { 
               schema: { message: 'Produto criado com sucesso'},
               description: 'Product created' 
    }
    #swagger.responses[500] = { 
        schema: { error: true, message: 'Ocorreu um erro em nossos sistemas. Tente novamente mais tarde.' },
        description: 'Internal error' 
    }
     */
  try {
    const { body } = req;
    let date = moment.tz(process.env.TIMEZONE_SAO_PAULO).format();
    body.registrationDate = date;

    const conn = await connFactory();
    const productsDao = new ProductsDao(conn);

    await productsDao.save(body);

    conn.end();

    return res.status(statusCode.Created).send({
      message: messages.productCreated,
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  /* 
   #swagger.tags = ['Products']
   #swagger.description = 'Update a product passing the values contained on the models'
   #swagger.parameters['id'] = { description: 'Product Id'} 

   #swagger.parameters['body'] = {
               in: 'body',
               description: 'Products information.',
               required: true,
               type: 'object',
               schema: { $ref: "#/definitions/ProductToUpdate" }
    }

    #swagger.responses[200] = { 
               schema: { message: 'Produto alterado com sucesso'},
               description: 'Product updated' 
    } 
    
    #swagger.responses[404] = { 
               schema: { message: 'Produto não encontrado'},
               description: 'Product Not Found'
    } 

    #swagger.responses[500] = { 
        schema: { error: true, message: 'Ocorreu um erro em nossos sistemas. Tente novamente mais tarde.' },
        description: 'Internal error' 
    } */

  try {
    const { body } = req;
    const {
      params: { id },
    } = req;
    let date = moment.tz(process.env.TIMEZONE_SAO_PAULO).format();
    body.updateDate = date;

    const conn = await connFactory();
    const productsDao = new ProductsDao(conn);

    const [rows] = await productsDao.getById(id);

    if (rows.length > 0) {
      await productsDao.save(body, id);

      return res.status(statusCode.Success).send({
        message: messages.productUpdated,
      });
    }
    conn.end();

    return res
      .status(statusCode.NotFound)
      .json({ message: messages.productNotFound });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductsById,
  createProduct,
  updateProduct,
};
