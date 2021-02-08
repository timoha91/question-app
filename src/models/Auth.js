import { Question } from "./Question"
import { createModal} from "../utils"

export function getAuthForm() {
    return `
    <!--  Form -->
    <form class="mui-form" id="auth-form">
        <div class="mui-textfield mui-textfield--float-label">
          <input type="email" id="email" required>
          <label for="email">E-mail</label>
        </div>
        <div class="mui-textfield mui-textfield--float-label">
          <input type="password" id="password" required>
          <label for="password">Пароль</label>
        </div>
        
        <button type="submit" class="mui-btn mui-btn--raised mui-btn--primary" id="button">Войти</button>
      </form>
    <!--  /Form -->
    `
}

export function authFormHandler(event) {
    event.preventDefault()
    const email = event.target.querySelector('#email').value
    const password = event.target.querySelector('#password').value
    const btn = event.target.querySelector('#button')
    btn.disabled = true
    authWithEmailAndPassword(email, password)
    .then(Question.fetch)
    .then(renderModalAfterAuth)
    .then(()=>btn.disabled = false)
    
}

function renderModalAfterAuth(content) {
    if (typeof content == 'string') {
        createModal('Ошибка', content)
    } else {
        createModal('Список вопросов', Question.listToHTML(content))
    }
}

export function authWithEmailAndPassword(email, password) {
    const API_KEY = 'AIzaSyBRUdX4Xo6BcjS0J5TsfMKVcb5v2ACDbqE'
    return fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,{
        method: 'POST',
        body: JSON.stringify({
            email,
            password,
            returnSecureToken: true
        }),
        headers: {
            'Content-Type' : 'application/json'
        }        
    })
    .then(response => response.json())
    .then(data => data.idToken)
}