import { Sequelize } from "sequelize";
import { envs } from "../enviroments/enviroments.js";

export const sequelize = new Sequelize(envs.DB_URI, {
    logging: false
})

export async function authenticated(){
    try {
        await sequelize.authenticate()
        console.log('Connection OK')
    } catch (error) {
        console.error(error);
    }
}

export async function syncUp() {
    try {
        await sequelize.sync()
        console.log('Synced connection OK');
    } catch (error) {
        console.error(error);
    }
}