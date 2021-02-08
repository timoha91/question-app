import 'core-js/stable';
import 'regenerator-runtime/runtime';
import WebpackLogo from '@/assets/webpack-logo.png'
import Post from '@models/Post'
import './styles/styles.css'
import { createModal, isValid } from './utils';
import { Question } from './models/Question';
import { authFormHandler, getAuthForm } from './models/Auth';

const form = document.getElementById('form')
const modalBtn = document.getElementById('modal-btn')
const input = form.querySelector('#question-input')
const submitBtn = form.querySelector('#submit')


window.addEventListener('load', Question.renderList())
form.addEventListener('submit',submitFormHandler)
modalBtn.addEventListener('click',openModal)

input.addEventListener('input', () => {
    submitBtn.disabled = !isValid(input.value)
})

function submitFormHandler (event) {
    event.preventDefault()
    
    if (isValid(input.value)) {
        const question = {
            text: input.value.trim(),
            date: new Date().toJSON()
        }

        submitBtn.disabled = true
        //async request to server to save question
        Question.create(question).then(() => {
            input.value = ''
            input.className = ''
            submitBtn.disabled = false
        })
               

    }

}



function openModal(){
    createModal('Авторизация', getAuthForm())
    document.getElementById('auth-form').addEventListener('submit', authFormHandler, {once:true})
}