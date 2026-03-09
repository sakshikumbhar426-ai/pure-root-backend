'use strict';

export default (sequelize, DataTypes) => {

  const Order = sequelize.define("Order", {

    order_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    total_amount: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },

    order_status: {
      type: DataTypes.STRING,
      defaultValue: "PLACED"
    },

    payment_status: {
      type: DataTypes.STRING,
      defaultValue: "PENDING"
    }

  }, {

    tableName: "orders",
  timestamps: true

  });

  /* ==========================
     ASSOCIATIONS
  ========================== */

  Order.associate = (models) => {

    // Order → User
    Order.belongsTo(models.User, {
      foreignKey: "userId",
      as: "Customer"
    });

    // Order → OrderItems
    Order.hasMany(models.OrderItem, {
      foreignKey: "orderId",
      as: "OrderItems",
      onDelete: "CASCADE"
    });

  };

  return Order;

};