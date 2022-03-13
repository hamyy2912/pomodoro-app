import { ERROR_MSG } from '../constants/messages';

/**
 * FETCH API
 */
const URL = 'http://localhost:3000/users';

/**
 * Get data from JSON server
 * @returns users array which is parsed from json
 */
export const get = async () => {
  try {
    const response = await fetch(URL);
    if (response.ok) {
      const users = await response.json();
      return users;  
    } else {
      throw response.statusText;
    }
  } catch (error) {
    console.error(ERROR_MSG + error);
  }
};

/**
 * Get user by Id
 * @param {number} id / user id
 * @returns user data which is parsed from json
 */
export const getUserById = async (id) => {
  try {
    const response = await fetch(`${URL}/${id}`);
    if (response.ok) {
      const user = await response.json();
      return user;  
    } else {
      throw response.statusText;
    }
  } catch (error) {
    console.error(ERROR_MSG + error);
  }
};

/**
 * Add new user to JSON server
 * @param {object} data / new user data
 */
export const post = async (data) => {
  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw response.statusText;
    }
  } catch (error) {
    console.error(ERROR_MSG + error);
  }
};

/**
 * Update task list data of specified user
 * @param {object} data / task list data of specified user
 * @param {number} id / user Id
 */
export const patch = async (data, id) => {
  try {
    const response = await fetch(`${URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw response.statusText;
    }
  } catch (error) {
    console.error(ERROR_MSG + error);
  }
};
