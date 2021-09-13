/* eslint-disable no-unused-vars */
"use strict";

const sinon = require("sinon");
const { expect } = require("chai");
const produtctsController = require("../../../app/controllers");
const mockExchange = sinon.mock(require("axios"));
const { messages } = require("../../../app/constants/messages");

describe("Unit tests for products controllers", () => {
  let mockResult;
  let mockMysql;
  const mockResponse = () => {
    const res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns(res);
    return res;
  };

  beforeEach(() => {
    mockMysql = sinon.mock(require("mysql2/promise"));
    mockExchange.expects("get").returns({
      data: {
        BRLUSD: {
          code: "BRL",
          codein: "USD",
          name: "Real Brasileiro/Dólar Americano",
          high: "0.1922",
          low: "0.1899",
          varBid: "0.0006",
          pctChange: "0.29",
          bid: "0.1911",
          ask: "0.1912",
          timestamp: "1631557410",
          create_date: "2021-09-13 15:23:30",
        },
        BRLEUR: {
          code: "BRL",
          codein: "EUR",
          name: "Real Brasileiro/Euro",
          high: "0.163",
          low: "0.1613",
          varBid: "0.0006",
          pctChange: "0.37",
          bid: "0.162",
          ask: "0.162",
          timestamp: "1631557382",
          create_date: "2021-09-13 15:23:02",
        },
        BRLINR: {
          code: "BRL",
          codein: "INR",
          name: "Real Brasileiro/Rúpia Indiana",
          high: "14.15",
          low: "14",
          varBid: "0.06",
          pctChange: "0.43",
          bid: "14.07",
          ask: "14.07",
          timestamp: "1631557382",
          create_date: "2021-09-13 15:23:02",
        },
      },
    });
  });
  afterEach(() => {
    mockMysql.restore();
  });
  context("Gets functions", () => {
    context("Get By ID", () => {
      it("Should execute query successfully and gets a product by its id and a success status code", async () => {
        mockResult = {
          name: "Tênis Nike Shox R4",
          value: 529.99,
          inventory: 10,
          gender: "Masculino",
          size: "null",
          active: 1,
          registratioDate: "2021-09-10T00:16:13.000Z",
          currencies: {
            EUR: 85.85,
            INR: 7456.95,
            USD: 101.33,
          },
        };

        mockMysql.expects("createConnection").returns({
          connect: () => {
            console.log("Succesfully connected");
          },
          query: (query, vars) => {
            return [[mockResult]];
          },
          end: () => sinon.stub(),
        });

        const req = { params: { id: 1 } };
        const res = mockResponse();
        const next = sinon.stub();

        await produtctsController.getProductsById(req, res, next);

        expect(res.status.called).true;
        expect(res.json.called).true;
        expect(res.status.calledWith(200)).to.be.equal(true);
        expect(res.json.args[0][0]).to.be.eql(mockResult);
      });
      it("Should execute query successfully and return an empty object and not found status code if product doesn't exist", async () => {
        mockMysql.expects("createConnection").returns({
          connect: () => {
            console.log("Succesfully connected");
          },
          query: (query, vars) => {
            return [[]];
          },
          end: () => sinon.stub(),
        });

        const req = { params: { id: 1 } };
        const res = mockResponse();
        const next = sinon.stub();

        await produtctsController.getProductsById(req, res, next);

        expect(res.status.called).true;
        expect(res.json.called).true;
        expect(res.status.calledWith(404)).to.be.equal(true);
        expect(res.json.args[0][0]).to.be.eql({
          message: messages.productNotFound,
        });
      });
      it("When it throws, should call next function", async () => {
        mockMysql.expects("createConnection").returns({
          connect: () => {
            console.log("Succesfully connected");
          },
          query: (query, vars) => {
            return [[]];
          },
          end: () => sinon.stub(),
        });

        const res = mockResponse();
        const next = sinon.stub();

        await produtctsController.getProductsById({}, res, next);

        expect(res.status.called).false;
        expect(res.json.called).false;
        expect(next.called).true;
      });
    });

    context("GetProducts", () => {
      it("Should return an empty object when database is empty and success status code", async () => {
        mockMysql.expects("createConnection").returns({
          connect: () => {
            console.log("Succesfully connected");
          },
          query: (query, vars) => {
            return [[]];
          },
          end: () => sinon.stub(),
        });

        const res = mockResponse();
        const next = sinon.stub();

        await produtctsController.getProducts({}, res, next);

        expect(res.status.called).true;
        expect(res.json.called).true;
        expect(res.status.calledWith(200)).to.be.equal(true);
        expect(res.json.args[0][0]).to.be.eql([]);
      });

      it("Should execute query successfully and fetch all products and success status code", async () => {
        const mockDBResult = [
          {
            name: "Tênis Nike Shox R4",
            value: 529.99,
            inventory: 10,
            gender: "Masculino",
            size: "null",
            active: 1,
            registratioDate: "2021-09-10T00:16:13.000Z",
          },
          {
            name: "Camiseta Nike Legend 2.0",
            value: 89.99,
            inventory: 11,
            gender: "Masculino",
            size: "null",
            active: 1,
            registratioDate: "2021-09-10T00:16:13.000Z",
          },
        ];

        mockResult = [
          {
            name: "Tênis Nike Shox R4",
            value: 529.99,
            inventory: 10,
            gender: "Masculino",
            size: "null",
            active: 1,
            registratioDate: "2021-09-10T00:16:13.000Z",
            currencies: {
              EUR: 85.85,
              INR: 7456.95,
              USD: 101.33,
            },
          },
          {
            name: "Camiseta Nike Legend 2.0",
            value: 89.99,
            inventory: 11,
            gender: "Masculino",
            size: "null",
            active: 1,
            registratioDate: "2021-09-10T00:16:13.000Z",
            currencies: {
              EUR: 14.57,
              INR: 1266.15,
              USD: 17.2,
            },
          },
        ];

        mockMysql.expects("createConnection").returns({
          connect: () => {
            console.log("Succesfully connected");
          },
          query: (query, vars) => {
            return [mockDBResult];
          },
          end: () => sinon.stub(),
        });

        const res = mockResponse();
        const next = sinon.stub();

        await produtctsController.getProducts({}, res, next);

        expect(res.status.called).true;
        expect(res.json.called).true;
        expect(res.status.calledWith(200)).to.be.equal(true);
        expect(res.json.args[0][0]).to.be.eql(mockResult);
      });

      it("When it throws, should call next function", async () => {
        mockMysql.expects("createConnection").returns({
          connect: () => {
            console.log("Succesfully connected");
          },
          query: (query, vars) => {
            return [[]];
          },
          end: () => sinon.stub(),
        });

        const res = mockResponse();
        const next = sinon.stub();

        await produtctsController.getProducts({}, {}, next);

        expect(res.status.called).false;
        expect(res.json.called).false;
        expect(next.called).true;
      });
    });
  });

  context("Create product function", () => {
    it("When it throws, should call next function", async () => {
      mockMysql.expects("createConnection").returns({
        connect: () => {
          console.log("Succesfully connected");
        },
        query: (query, vars) => {
          return [[]];
        },
        end: () => sinon.stub(),
      });

      const res = mockResponse();
      const next = sinon.stub();

      await produtctsController.createProduct({}, {}, next);

      expect(res.status.called).false;
      expect(res.json.called).false;
      expect(next.called).true;
    });

    it("When a product is created, returns a success message and created status code", async () => {
      mockMysql.expects("createConnection").returns({
        connect: () => {
          console.log("Succesfully connected");
        },
        query: (query, vars) => {
          return "Ok";
        },
        end: () => sinon.stub(),
      });

      const req = { body: {} };

      const res = mockResponse();
      const next = sinon.stub();

      await produtctsController.createProduct(req, res, next);

      expect(res.status.called).true;
      expect(res.json.called).true;
      expect(res.status.calledWith(201)).to.be.equal(true);
      expect(res.json.args[0][0]).to.be.eql({
        message: messages.productCreated,
      });
    });
  });

  context("Update product function", () => {
    it("When it throws, should call next function", async () => {
      mockMysql.expects("createConnection").returns({
        connect: () => {
          console.log("Succesfully connected");
        },
        query: (query, vars) => {
          return [[]];
        },
        end: () => sinon.stub(),
      });

      const res = mockResponse();
      const next = sinon.stub();

      await produtctsController.updateProduct({}, {}, next);

      expect(res.status.called).false;
      expect(res.json.called).false;
      expect(next.called).true;
    });

    it("When a product is updated, returns a success message and status code", async () => {
      mockResult = {
        name: "Tênis Nike Shox R4",
        value: 529.99,
        inventory: 10,
        gender: "Masculino",
        size: "null",
        active: 1,
        registratioDate: "2021-09-10T00:16:13.000Z",
      };

      mockMysql.expects("createConnection").returns({
        connect: () => {
          console.log("Succesfully connected");
        },
        query: (query, vars) => {
          return [[mockResult]];
        },
        end: () => sinon.stub(),
      });

      const req = { body: {}, params: { id: 1 } };

      const res = mockResponse();
      const next = sinon.stub();

      await produtctsController.updateProduct(req, res, next);

      expect(res.status.called).true;
      expect(res.json.called).true;
      expect(res.status.calledWith(200)).to.be.equal(true);
      expect(res.json.args[0][0]).to.be.eql({
        message: messages.productUpdated,
      });
    });
    it("When a product is supposed to be updated, but not found, returns a not found message and status code", async () => {
      mockMysql.expects("createConnection").returns({
        connect: () => {
          console.log("Succesfully connected");
        },
        query: (query, vars) => {
          return [[]];
        },
        end: () => sinon.stub(),
      });

      const req = { body: {}, params: { id: 1 } };

      const res = mockResponse();
      const next = sinon.stub();

      await produtctsController.updateProduct(req, res, next);

      expect(res.status.called).true;
      expect(res.json.called).true;
      expect(res.status.calledWith(404)).to.be.equal(true);
      expect(res.json.args[0][0]).to.be.eql({
        message: messages.productNotFound,
      });
    });
  });
});
