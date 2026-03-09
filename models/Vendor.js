'use strict';

/**
 * Vendor Model: 
 * Ye model store ki details (Shop Name, Description) save karta hai
 * aur 'userId' ke zariye batata hai ki is shop ka malik kaunsa user hai.
 */
export default (sequelize, DataTypes) => {
  const Vendor = sequelize.define(
    "Vendor",
    {
      vendor_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      shop_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Shop name cannot be empty" },
        }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      verified_status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // Hamesha false rahega jab tak Admin verify na kare
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true, // Location optional rakhi hai
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true, // Ek User sirf ek hi Vendor profile bana sakta hai
      },
    },
    {
      tableName: "vendors",
      timestamps: true, // Isse 'createdAt' aur 'updatedAt' automatic ban jayenge
    }
  );

  // Associations (Relations define karna)
  Vendor.associate = (models) => {
    // 1. Vendor ek User ka hissa hai (One-to-One)
    Vendor.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
      onDelete: "CASCADE",
    });

    // 2. Ek Vendor ke paas bahut saare Products ho sakte hain (One-to-Many)
    Vendor.hasMany(models.Product, {
      foreignKey: "vendorId",
      as: "products",
      onDelete: "CASCADE",
    });
  };

  return Vendor;
};