/**
 * LOGIN FORM
 * Open and close the form
 * Form validation
 */
import { getElementById, createElement } from '../helper/dom';
import { get, post } from '../helper/fetchApi';
import '../constants/messages';
import { 
  EXISTENT_EMAIL_WARN, 
  INCORRECT_EMAIL_WARN, 
  INCORRECT_PASSWORD_WARN, 
  NONEXISTENT_EMAIL_WARN, 
  SHORT_PASSWORD_WARN, 
  SIGNUP_SUCCESSFULLY 
} from '../constants/messages';
import TaskListView from './taskList';

export default class AuthenticationView extends TaskListView {
  constructor(taskView, clock) {
    super(taskView, clock);
    this.successMsg = getElementById('success-msg');
    this.errorMsg = getElementById('error-msg');
    this.showLoginBtn = getElementById('show-login-btn');
    this.loginModal = getElementById('login-modal');
    this.closeModalBtn = getElementById('close-modal-btn');
    this.loginForm = getElementById('login-form');
    this.email = getElementById('input-email');
    this.password = getElementById('input-password');
    this.createAccountBtn = getElementById('create-account');
    this.loginBtn = getElementById('login-btn');
    this.logoutBtn = getElementById('logout-btn');
    this.logBlock = getElementById('log-block');
    this.loginMode = true; 
  }
  /**
   * Open login modal
   */
  bindOpenLoginModal() {
    this.showLoginBtn.addEventListener('click', () => {
      this.loginModal.classList.remove('hide');
    });
  }

  /**
   * Function for close login modal
   */
  closeModal(event) {
    event.preventDefault();
    this.loginModal.classList.add('hide');
    this.loginForm.reset();
    this.removeMsg(); 
    this.loginBtn.value = 'Login';
    this.loginMode = true;
  }

  /**
   * Assign close login modal to close button
   */
  bindCloseLoginModal() {
    this.closeModalBtn.addEventListener('click', (event) => {
      this.closeModal(event);
    });
  }

  get emailInput() {
    return this.email.value;
  }

  get passwordInput() {
    return this.password.value;
  }

  /**
   * Add new user to JSON server
   * @param {user} users list
   */
  async createNewUser(users) {
    const newUserData = {
      'id': users.length,
      'userEmail': this.emailInput,
      'password': this.passwordInput,
      'taskList': [],
      'selectedTask': null
    };
    post(newUserData);
  }

  /**
   * Insert messages when login
   * @param {string} content 
   * @param {boolean} successMsg / is this a message for success
   */
  insertMsg(content, isSuccessMsg) {
    if (isSuccessMsg) {
      this.successMsg.textContent = content;
      this.successMsg.classList.remove('hide');
      this.errorMsg.classList.add('hide');
    } else {
      this.errorMsg.textContent = content;
      this.successMsg.classList.add('hide');
      this.errorMsg.classList.remove('hide');
    }
  }

  /**
   * Remove messages when login
   */
  removeMsg() {
    this.successMsg.classList.add('hide');
    this.errorMsg.classList.add('hide');
  }

  /**
   * Validate password
   * Validate new user email (must include @ and .com) and password (length must be greater than 4)
   * @param {callback} handler / function for loading user data
   * @param {event} event 
   */
  async validationLoginForm () {
    // Get users list from JSON
    const users = await get();
    let userExists = false;
    let successUser;
    
    // If login
    if (this.loginMode) {
      users.forEach((user) => {
        if (this.emailInput == user.userEmail) { // User exists
          userExists = true;
          if (this.passwordInput == user.password) { // Validate correct password
            successUser = user;
          } else {
            this.insertMsg(INCORRECT_PASSWORD_WARN);
          }
        }
      });
      if (!userExists) {
        this.insertMsg(NONEXISTENT_EMAIL_WARN);
      }
    // If signup
    } else {
      users.forEach((user) => {
        if (this.emailInput == user.userEmail) {
          userExists = true;
        }
      });
      if (userExists) {
        this.insertMsg(EXISTENT_EMAIL_WARN);
      } else {
        if (this.emailInput.includes('@', '.com')) { // Validate correct mail form 
          if (this.passwordInput.length > 4) { // Validate correct password form
            this.createNewUser(users);
            this.insertMsg(SIGNUP_SUCCESSFULLY, true);
            this.loginMode = true;
            this.loginBtn.value = 'Login';  
          } else {
            this.insertMsg(SHORT_PASSWORD_WARN);
          }
        } else {
          this.insertMsg(INCORRECT_EMAIL_WARN);  
        }
      }
    }
    return successUser;
  }

  /**
   * Render
   * @param {} handler 
   */
  renderUserEmail(userEmail) {
    const userEmailElement = createElement('p');
    userEmailElement.textContent = userEmail;
    userEmailElement.className = 'user-email';
    userEmailElement.id = 'user-email';
    this.logBlock.insertBefore(userEmailElement, this.logoutBtn);
  }

  /**
   * Change to Signup mode
   */
  bindCreateAccount () {
    this.createAccountBtn.addEventListener('click', () => {
      this.loginBtn.value = 'Signup';
      this.loginMode = false;
      this.removeMsg();
    });
  }

  /**
   * Login
   */
  bindLogin(handler) {
    this.loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const user = await this.validationLoginForm();
      if (user) {
        handler(user.id);
        this.renderUserEmail(user.userEmail);
        this.removeMsg();
        this.closeModal(event);
        this.logoutBtn.classList.remove('hide');
        this.showLoginBtn.classList.add('hide');  
      }
    });
  }

  /**
   * Logout
   */
  bindLogout(handler) {
    this.logoutBtn.addEventListener('click', () => {
      this.showLoginBtn.classList.remove('hide');
      this.logoutBtn.classList.add('hide');
      handler();

      const userEmail = getElementById('user-email');
      userEmail.remove();
    });
  }
}
