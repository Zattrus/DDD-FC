import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", "123", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it("should find an order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    customer.changeAddress(new Address("Street 1", 1, "Zipcode 1", "City 1"));
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const item = new OrderItem("1", product.name, product.price, product.id, 2);
    const order = new Order("123", customer.id, [item]);
    const repository = new OrderRepository();
    await repository.create(order);

    const found = await repository.find(order.id);

    expect(found.id).toBe(order.id);
    expect(found.customerId).toBe(order.customerId);
    expect(found.total()).toBe(order.total());
    expect(found.items).toHaveLength(1);
    expect(found.items[0].id).toBe(item.id);
  });

  it("should find all orders", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    customer.changeAddress(new Address("Street 1", 1, "Zipcode 1", "City 1"));
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const repository = new OrderRepository();
    await repository.create(
      new Order("123", customer.id, [
        new OrderItem("1", product.name, product.price, product.id, 1),
      ])
    );
    await repository.create(
      new Order("456", customer.id, [
        new OrderItem("2", product.name, product.price, product.id, 2),
      ])
    );

    const orders = await repository.findAll();

    expect(orders).toHaveLength(2);
    expect(orders.map((order) => order.id)).toEqual(["123", "456"]);
  });

  it("should update an order and its items", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    customer.changeAddress(new Address("Street 1", 1, "Zipcode 1", "City 1"));
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const repository = new OrderRepository();
    await repository.create(
      new Order("123", customer.id, [
        new OrderItem("1", product.name, product.price, product.id, 1),
      ])
    );

    const updatedOrder = new Order("123", customer.id, [
      new OrderItem("2", product.name, product.price, product.id, 3),
    ]);
    await repository.update(updatedOrder);

    const orderModel = await OrderModel.findOne({
      where: { id: updatedOrder.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: 30,
      items: [
        {
          id: "2",
          name: "Product 1",
          price: 10,
          quantity: 3,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });
});
