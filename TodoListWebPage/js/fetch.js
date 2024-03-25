window.onload = getTodos()

document.getElementById('todoModal').addEventListener('show.bs.modal', event => createModal(event))
document.getElementById('todoModal').querySelector('form').addEventListener('submit', handleForm)

function handleForm(e)
{
    e.preventDefault()
    const form = e.target
    const formData = new FormData(form)
    const todo = Object.fromEntries(formData);
    console.log(todo)
    if(todo.id == 0)
    {
        console.log('post')
        postTodos(todo)
    }
    else
    {
        console.log('put')
        putTodos(todo)
    }

    var myModal = bootstrap.Modal.getInstance(document.getElementById('todoModal'))
    myModal.hide()
}

function postTodos(todo)
{
    const apiAddress = `https://localhost:7048/todolist`  
    fetch(apiAddress,
    {
        method: 'POST',
        headers: {
            'Accept' : 'application/json, text/plain, */*' ,
            'Content-Type' : 'application/json'},
        body: JSON.stringify(todo)
    })
    .then( res => {
        console.log(res.status)
        if(res.status == 201)
        {
            return res.json()
        }
        else
        {
            throw new Error('cannot post todo')
        }
    })
    .then( body => {
        console.log(body)
  
        let html = generateItem(body)
        let accordion = document.getElementById('todoAccordion')
        accordion.appendChild(document.createElement(`div`))
        accordion.lastChild.outerHTML = html        
        
    })
    .catch( e => {
        console.log('Catch', e)})
}

function putTodos(todo)
{
    const apiAddress = `https://localhost:7048/todolist/update/${todo.id}`
    fetch(apiAddress,
    {
        method: 'PUT',
        headers: {
            'Accept' : 'application/json, text/plain, */*' ,
            'Content-Type' : 'application/json'},
        body: JSON.stringify(todo)
    })
    .then( res => res.status)
    .then( stat => {
        console.log(stat)
        if( stat == 200 )
        {
            let html = generateItem(todo)
            document.getElementById(`accordion${todo.id}`).outerHTML = html
        }
    })
    .catch( e => {
        console.log('Catch', e)})
}

function getTodos()
{
    const apiAddress = 'https://localhost:7048/todolist'
    fetch(apiAddress)
    .then( res => res.json())
    .then( data => {
        let html = ``
        data.forEach(element => {
            console.log(element)
            html += generateItem(element)
        });
        document.getElementById('todoAccordion').innerHTML += html
        })
    .catch( e => {
        console.log('Catch', e)})
}

function updateTodo(id)
{
    console.log(`update id: ${id}`)
}

function deleteTodo(id)
{
    const apiAddress = `https://localhost:7048/todolist/delete/${id}`
    fetch(apiAddress,
    {
        method: 'DELETE',
        headers: {
            'Accept' : 'application/json, text/plain, */*' ,
            'Content-Type' : 'application/json'}
    })
    .then( res => res.status)
    .then( stat => {
        console.log(stat)
        if( stat == 200 )
        {
            document.getElementById(`accordion${id}`).remove()
        }
    
    })
    .catch( e => {
        console.log('Catch', e)})
}

function generateItem(obj)  //use clone node?  add color on accordion-button depending on status
{
    return `<div class="accordion-item" id="accordion${obj.id}">
    <h2 class="accordion-header">
        <div class="row align-items-center">
            <div class="col">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${obj.id}" aria-expanded="false" aria-controls="collapse${obj.id}">
                    <div class="col">
                        <strong>Title: </strong>
                        <label id="todotitle${obj.id}">${obj.title}</label>
                    </div>
                    <div class="col">
                        <strong>Status:</strong>
                        <label id="todostatus${obj.id}">${obj.status}</label>
                    </div>                
                </button>
            </div>
            <div class="col-1">
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#todoModal" data-bs-id="${obj.id}" data-bs-title="Update">Update</button>
        </div>
            <div class="col-1">
                <div class="col1 btn btn-danger" onclick="deleteTodo(${obj.id})"> Delete</div>
            </div>
        </div>
    </h2>
    <div id="collapse${obj.id}" class="accordion-collapse collapse" data-bs-parent="#todoAccordion">
        <div class="accordion-body">
        <strong>Description:</strong>
        <label id="tododescription${obj.id}">${obj.description}</label>
        </div>
    </div>
    </div>`
}

function createModal(event)
{
    const exampleModal = document.getElementById('todoModal')
    const id = event.relatedTarget.getAttribute('data-bs-id')
    const title = event.relatedTarget.getAttribute('data-bs-title')

    const modalTitle = exampleModal.querySelector('.modal-title')
    const modalid = exampleModal.querySelector('#todoid')
    const modalTodoTitle = exampleModal.querySelector('#inputTitle')
    const modalStatus = exampleModal.querySelector('#inputStatus')
    const modalTodoDesc = exampleModal.querySelector('#inputTextArea')
    const modalButton = exampleModal.querySelector('#inputButton')

    modalTitle.textContent = `${title} Todo`
    modalid.setAttribute('value', `${id}`)

    if(id > 0)
    {
        const todoItem = document.getElementById(`accordion${id}`)
        const todoTitle = todoItem.querySelector(`#todotitle${id}`).innerHTML
        const todoStatus = todoItem.querySelector(`#todostatus${id}`).innerHTML
        const todoDescription = todoItem.querySelector(`#tododescription${id}`).innerHTML

        
        modalTodoTitle.value = todoTitle
        modalStatus.value = todoStatus
        modalTodoDesc.value = todoDescription
        modalButton.innerHTML = 'Update'
    }
    else
    {
        modalTodoTitle.value = ''
        modalTodoDesc.value = ''
        modalButton.innerHTML = 'Create'
    }

}
