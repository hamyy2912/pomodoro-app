/**
 * DOM IMPLEMENTS
 */

/**
 * Get DOM element by id
 * @param {string} id
 */
export const getElementById = (id) => {
  const element = document.getElementById(id);
  return element;
};

/**
 * Get DOM element by class name
 * @param {string} class name
 */
export const getElementsByClassName = (className) => {
  const elements = document.getElementsByClassName(className);
  return elements;
};

/**
 * Create DOM element by tag name
 * @param {string} tag name
 */
export const createElement = (tagName) => {
  const element = document.createElement(tagName);
  return element;
};
