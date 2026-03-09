module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("orders", "status", {
      type: Sequelize.ENUM(
        "PLACED",
        "CONFIRMED",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED"
      ),
      defaultValue: "PLACED",
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("orders", "status");
  },
};
