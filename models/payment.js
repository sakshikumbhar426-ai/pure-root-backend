'use strict';

export default (sequelize, DataTypes) => {
  const Payment = sequelize.define("Payment", {
    payment_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    
    // FIX IS HERE: Must be INTEGER to match the Orders table
    orderId: {
      type: DataTypes.INTEGER, 
      allowNull: false,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    payment_method: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("PENDING", "SUCCESS", "FAILED", "REFUNDED"),
      defaultValue: "PENDING",
      allowNull: false,
    },
  }, {
    tableName: "payments",
  });

  Payment.associate = (models) => {
    Payment.belongsTo(models.Order, { foreignKey: "orderId" });
    Payment.belongsTo(models.User, { foreignKey: "userId" });
  };

  return Payment;
};