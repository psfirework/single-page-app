import {createModal, isValid} from "./utils";
import {Question} from "./question";
import {getAuthorization, authWithMailAndPassword} from "./authorization";
import './style.css';

const form = document.getElementById('form');
const modalBtn = document.getElementById('modal-btn');
const input = form.querySelector('#question-input');
const submitBtn = form.querySelector('#submit');

window.addEventListener('load', Question.renderList);
form.addEventListener('submit', submitFormHandler);
input.addEventListener('input', () => {
    submitBtn.disabled = !isValid(input.value)
});
modalBtn.addEventListener('click', openModal);

function submitFormHandler(event) {
    event.preventDefault();

    if (isValid(input.value)) {
        const question = {
            text: input.value.trim(),
            date: new Date().toJSON()
        };

        submitBtn.disabled = true;
        Question.create(question).then(() => {
            input.value = '';
            input.className = '';
            submitBtn.disabled = false;
        })

    }
}

function openModal() {
    createModal('Authorization', getAuthorization());

    document
        .getElementById('auth-form')
        .addEventListener('submit', authFormHandler, {once: true})
}

function authFormHandler(event) {
    event.preventDefault();

    const btn = event.target.querySelector('button');
    const email = event.target.querySelector('#email').value;
    const password = event.target.querySelector('#password').value;

    btn.disabled = true;
    authWithMailAndPassword(email, password)
        .then(Question.fetch)
        .then(renderModalAfterAuth)
        .then(() => btn.disabled = false)
}

function renderModalAfterAuth(content) {
    if (typeof content === 'string') {
        createModal('Error!', content)
    } else {
        createModal('All questions', Question.listToHTML(content))
    }
}