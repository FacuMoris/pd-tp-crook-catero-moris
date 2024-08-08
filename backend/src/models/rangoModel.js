const connection = require("../../db");
const { formatToday } = require("../helpers/dateHelper");

exports.all = async () => {
  const query = `
        SELECT id, rango, nro_div
        FROM rango
        ORDER BY id ASC;
        `;
  try {
    [rangos] = await connection.query(query);

    console.log("RANGOS-> " + rangos);
    const results = formatRango(rangos);
    //console.log("RANGOSFORMAT-> " + results);

    return results;
  } catch (error) {
    console.log(error);
  }
};

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

exports.create = async ({ rango, nro_div }) => {
  const query = `
      INSERT INTO rango(rango, nro_div, fecha_alta, fecha_modif)
      VALUES(?, ?, ?, ?)
      `;

  const values = [rango, nro_div, formatToday(), formatToday()];
  try {
    await connection.query(query, values);
  } catch (error) {
    throw error;
  }
};

exports.update = async (ID, rango, nro_div) => {
  const query = `
      UPDATE rango
      SET rango = ?,
      nro_div = ?,
      fecha_modif = ?
      WHERE id = ?
      `;

  const values = [rango, nro_div, formatToday(), ID];

  try {
    await connection.query(query, values);
  } catch (error) {
    throw error;
  }
};

exports.formatRango = async (ID) => {
  const query = `
          SELECT CONCAT(rango, ' ', nro_div) as rango
          FROM rango
          WHERE id = ?
          `;

  try {
    [rango] = await connection.query(query, [ID]);
    result = rango.length == 1 ? rango : null;
    return result;
  } catch (error) {
    throw error;
  }
};
