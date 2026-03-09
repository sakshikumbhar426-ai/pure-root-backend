'use strict';

export default (sequelize, DataTypes) => {

  const Product = sequelize.define("Product", {

    product_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    product_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    // FIXED
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    material_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    packaging_type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Eco-Friendly",
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    latitude: {
      type: DataTypes.DECIMAL(10,8),
      allowNull: true,
    },

    longitude: {
      type: DataTypes.DECIMAL(11,8),
      allowNull: true,
    },

    location_address: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    eco_score: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100
      }
    },

    vendorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }

  }, {

    tableName: "products",
    timestamps: true,

  });

  // ASSOCIATIONS
  Product.associate = (models) => {

    Product.belongsTo(models.Vendor, {
      foreignKey: "vendorId",
      onDelete: "CASCADE",
    });

  };

  return Product;
};