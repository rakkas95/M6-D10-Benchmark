const db = require('../db');

class Model {
    constructor(name) {
        this.name=name;
    }
    async run(query) {
        try {
            const response = await db.query(query);
            return response
        } catch (error) {
            throw new Error(error);
        }
    }

    async findById(id) {
        if (!id) {
            throw new Error("id is missing.");
        }
        const query = `SELECT * FROM ${this.name} WHERE id=${parseInt(id, 10)}`;
        const response = await this.run(query);
        return response;
    }

    async findByIdAndDelete(id) {
        if (!id) {
            throw new Error("id is missing.");
        }
        const query = `DELETE * FROM ${this.name} WHERE id=${parseInt(id, 10)}`;
        const response = await this.run(query);
        return response;
    }

    async findByIdAndUpdate(id, fields) {
        if (!id) {
            throw new Error("id is missing.");
        }
        const entries = object.entries(fields);
        const query = `UPDATE ${this.name} SET ${entries
            .map(([column, value]) => `${column}='${value}'`)
            .join(",")} WHERE id=${parseInt(id)};`;
        const response = await this.run(query);
        return response;
    }

    async find(fields) {
        if (!fields || Object.values(fields).length === 0) {
          const query = `SELECT * FROM ${this.name}`;
          const response = await this.run(query);
          return response;
        }
        const entries = Object.entries(fields);
        const whereClause = `${entries
          .map(([key, value]) => `${key}='${value}'`)
          .join(" AND ")}`;
        const query = `SELECT * FROM ${this.name} WHERE  ${whereClause};`;
        const response = await this.run(query);
        return response;
      }

    async save(fields) {
        if (!fields || Object.values(fields).length === 0) {
          throw new Error("How can I create without values?");
        }
        const columns = Object.keys(fields);
        const values = Object.values(fields);
        const query = `INSERT INTO  ${this.name} (${columns.join(
          ","
        )}) VALUES (${values.map((v) => `'${v}'`).join(",")});`;
        const response = await this.run(query);
        return response;
      }

}

module.exports = Model;