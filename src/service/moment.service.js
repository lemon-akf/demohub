const connection = require("../app/database");
const sqlFragement = `SELECT 
m.id id, m.content content, m.createAt createTime, m.updateAt updateTime,
JSON_OBJECT('id',u.id,'name',u.name) user
FROM moment m
LEFT JOIN user u ON m.user_id = u.id `;
class MomentService {
  async cerate(userId, content) {
    console.log("MomentCreate", userId, content);
    const statement = `INSERT INTO moment (content,user_id) VALUES (?,?)`;
    const result = await connection.execute(statement, [content, userId]);
    return result[0];
  }
  async getMomentById(id) {
    const statement = `
        SELECT 
        m.id id, m.content content, m.createAt createTime, m.updateAt updateTime,
        JSON_OBJECT('id',u.id,'name',u.name,'avatar_url',u.avatar_url) author,
        IF(COUNT(l.id),JSON_ARRAYAGG(JSON_OBJECT('id',l.id,'name',l.name)),JSON_ARRAY()) labels,
        (SELECT IF(COUNT(c.id),JSON_ARRAYAGG(
          JSON_OBJECT('id',c.id,'content',c.content,'commentId',c.comment_id,'createTime',c.createAt,
                      'user',JSON_OBJECT('id',cu.id,'name',cu.name))
          ),NULL) FROM comment c LEFT JOIN user cu ON c.user_id = cu.id WHERE m.id = c.moment_id) comments,
          (SELECT JSON_ARRAYAGG(CONCAT('http://localhost:8000/moment/images/', file.filename)) 
	FROM file WHERE m.id = file.moment_id) images
      FROM moment m
      LEFT JOIN user u ON m.user_id = u.id 
      LEFT JOIN moment_label ml ON m.id = ml.moment_id
      left JOIN label l ON ml.label_id = l.id
      WHERE m.id =? 
      GROUP BY m.id;
    `;
    try {
      const [result] = await connection.execute(statement, [id]);
      return result[0];
    } catch (error) {
      console.log("error", error);
    }
  }
  async getMomentList(offset, size) {
    const statement = `SELECT 
      m.id id, m.content content, m.createAt createTime, m.updateAt updateTime,
      JSON_OBJECT('id',u.id,'name',u.name) user,
      (SELECT COUNT(*) FROM moment_label WHERE moment_label.moment_id = m.id) labelCount,
      (SELECT COUNT(*) FROM comment WHERE comment.moment_id = m.id) commentCount
    FROM moment m
    LEFT JOIN user u ON m.user_id = u.id 
    LIMIT ? ,? ;
    `;
    try {
      const [result] = await connection.execute(statement, [offset, size]);
      return result;
    } catch (error) {
      console.log(error);
    }
  }
  async update(content, momentId) {
    const statement = `UPDATE moment SET content = ? WHERE id = ?;`;
    const [result] = await connection.execute(statement, [content, momentId]);
    return result;
  }
  async remove(momentId) {
    const statement = `DELETE FROM moment WHERE id = ?`;
    const [result] = await connection.execute(statement, [momentId]);
    return result;
  }
  async hasLabel(momentId, labelId) {
    const statement = `SELECT * FROM moment_label WHERE moment_id = ? AND label_id = ?`;
    const [result] = await connection.execute(statement, [momentId, labelId]);
    return result[0] ? true : false;
  }

  async addLabel(momentId, labelId) {
    const statement = `INSERT INTO moment_label (moment_id, label_id) VALUES (?, ?);`;
    const [result] = await connection.execute(statement, [momentId, labelId]);
    return result;
  }
}
module.exports = new MomentService();
