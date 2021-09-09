class ProductsDao {
  constructor(connection) {
    this.connection = connection;
  }

  async getAll() {
    return await this.connection.query("SELECT * FROM PRODUCTS");
  }

  async getById(id) {
    return await this.connection.query(
      "SELECT * FROM PRODUCTS WHERE id = ?",
      id
    );
  }

  async save(product) {
    if (!product.id) {
      console.log("PRODUCT INSERT OPERATION");
      return await this.connection.query("INSERT INTO PRODUCTS SET ?", product);
    }

    console.log("PRODUCT UPDATE OPERATION");

    return await this.connection.query("UPDATE PRODUCTS SET ? WHERE id = ?", [
      product,
      product.id,
    ]);
  }
}

module.exports = ProductsDao;
