const Sequelize = require('sequelize');

try {
    var sequelize = new Sequelize(process.env.DB, process.env.DB_USER, process.env.DB_PASS, {
        host: process.env.HOST,
        dialect: 'postgres',
        define: {
            charset: 'utf8',
            collate: 'utf8_general_ci',
            timestamps: true
        },
        pool: {
            pool: {
                max: 15,
                min: 5,
                idle: 20000,
                evict: 15000,
                acquire: 30000
            },
        }
    });
} catch (error) {
    console.log(error)
}



// try {
//     sequelize.authenticate().then(() => console.log('DATABASE Connection has been established successfully.'));
// } catch (error) {
//     console.error('Unable to connect to the database:', error);
// }
module.exports = sequelize;

