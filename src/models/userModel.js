const { client } = require('../../config/elasticsearch');

const index = 'users';

class User {
  static async create(user) {
    try {
      const response = await client.index({
        index,
        id: user.outlookId,
        body: user
      });
      console.log("🚀 ~ file: userModel.js:11 ~ User ~ create ~ response:", JSON.stringify(response));
      const responseInfo = await client.get({
        index,
        id: response._id
      })
      return responseInfo._source;
    } catch (error) {
      console.error("Error creating user:", error);
      return null;
    }
  }
  
  
  

  static async findById(id) {
    try {
      const response  = await client.get({
        index,
        id: id,
      });
      // console.log("🚀 ~ file: userModel.js:34 ~ User ~ findById ~ response:", response);
      return response._source;
    } catch (error) {
      if (error.meta && error.meta.body && error.meta.body.found === false) {
        return null; // Return null if user is not found
      }
      throw error; // Re-throw other errors
    }
  }

  static async updateUser(id, user) {
    try {
      // console.log("Updating user with id:", id);
      // console.log("User data:",JSON.stringify(user));
      const body = await client.update({
        index,
        id: id,
        body: {
          doc: user,
        },
      });
      return body;
    } catch (error) {
      throw error; // Re-throw the error if update fails
    }
  }
}

module.exports = User;
