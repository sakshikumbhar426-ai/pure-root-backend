const CartModel = (sequelize, DataTypes) => {
  const Cart = sequelize.define("Cart", {
    cart_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  });

  Cart.associate = (models) => {
    Cart.belongsTo(models.User, { foreignKey: "userId" });
    Cart.belongsTo(models.Product, { foreignKey: "productId" });
  };

  return Cart;
};

export default CartModel;