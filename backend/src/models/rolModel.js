import { query as _query } from "../../db";
import { formatToday } from "../helpers/dateHelper";

export async function find(ID) {
  const query = `
        SELECT id, rango, nro_div
        FROM rango
        WHERE id = ?
        `;

  try {
    [rango] = await _query(query, [ID]);
    result = rango.length == 1 ? formatRango(rango) : null;
    return result;
  } catch (error) {
    throw error;
  }
}

export async function create() {}
