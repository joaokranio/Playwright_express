import { expect, test } from '@playwright/test'
import { TaskModel } from './fixtures/task.model'
import { deleteTaskByHelper, postTask } from './support/helpers'
import { TaskPages } from './support/pages/tasks'

test.beforeEach(async ({ page }) => {
    const tasksPages: TaskPages = new TaskPages(page)
    await tasksPages.go()
})

test('deve poder cadastrar uma nova tarefa', async ({ page, request }) => {
    // Dado que eu tenho uma nova tarefa
    const task: TaskModel = {
        name: 'Ler um livro de TypeScript',
        is_done: false
    }
    await deleteTaskByHelper(request, task.name)

    // Quando faço o cadastro dessa tarefa
    const tasksPages: TaskPages = new TaskPages(page)
    await tasksPages.create(task)

    // Então essa tarefa deve ser exibida na lista
    await tasksPages.shouldHaveText(task.name)
})

test('não deve permitir tarefa duplicada', async ({ page, request }) => {
    // Dado que eu tenho uma nova tarefa 
    const task: TaskModel = {
        name: 'Tarefa duplicada',
        is_done: false
    }
    await deleteTaskByHelper(request, task.name)
    await postTask(request, task)

    // Quando tento cadastrar novamente a mesma tarefa
    const tasksPages: TaskPages = new TaskPages(page)
    await tasksPages.create(task)

    // Então deverá ser exibido um pop-up informando que a tarefa já foi cadastrada 
    await tasksPages.alertHaveText('Task already exists!')
})

test('campo obrigatório', async ({ page }) => {
    // Dado que eu não tenho informações de uma tarefa
    const task: TaskModel = {
        name: '',
        is_done: false
    }

    // Quando tento realizar o cadastro da tarefa sem passar as informações.
    const tasksPages: TaskPages = new TaskPages(page)
    await tasksPages.create(task)

    // Então o sistema me informa que não é possível realizar essa ação.
    const validationMessage = await tasksPages.inputTaskName.evaluate(e => (e as HTMLInputElement).validationMessage)
    expect(validationMessage).toEqual('This is a required field')
})