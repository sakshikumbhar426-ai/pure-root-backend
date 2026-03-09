"use strict";

export default (sequelize, DataTypes) => {

  const OrderItem = sequelize.define(
    "OrderItem",
    {
      order_item_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      price: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
      },

      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      productId: {  
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "order_items",
      timestamps: true,
    }
  );

  /* ==========================
     ASSOCIATIONS
  ========================== */

  OrderItem.associate = (models) => {

    // OrderItem → Order
    OrderItem.belongsTo(models.Order, {
      foreignKey: "orderId",
      as: "Order",
      onDelete: "CASCADE",
    });

    // OrderItem → Product
    OrderItem.belongsTo(models.Product, {
      foreignKey: "productId",
      as: "Product",
      onDelete: "CASCADE",
    });

  };

  return OrderItem;

};