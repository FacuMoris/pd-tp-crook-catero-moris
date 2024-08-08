const connection = require("../../db");
const { formatToday } = require("../helpers/dateHelper");

exports.find = async (ID) => {
  const query = `
        SELECT id, rango, nro_div
        FROM rango
        WHERE id = ?
        `;

  try {
    [rango] = await connection.query(query, [ID]);
    result = rango.length == 1 ? formatRango(rango) : null;
    return result;
  } catch (error) {
    throw error;
  }
};
