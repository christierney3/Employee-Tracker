const connection = require("../config/connection");

/**
 * 
 * @param {string} column 
 * @param {string} table
 * @returns {array}
 */

 async function showChoices(column, table) {
    
    let results = await connection.promise().query(`SELECT ${column} FROM ${table}`)
    let choices = [];

    results[0].forEach(element => choices.push(element[`${column}`]))
    return choices;
    
};

/**
 * @async 
 * @param {string} table
 * @param {string} column
 * @param {string} value
 * @returns {number}
 */

async function findId(table, column, value) {
    let results = await connection.promise().query(`SELECT id from ${table} WHERE ${column} = '${value}'`)
    
    let thisID = results[0][0].id;

    return thisID;
}

module.exports = {showChoices, findId};