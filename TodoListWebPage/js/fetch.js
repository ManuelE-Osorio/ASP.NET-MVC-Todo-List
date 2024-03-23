window.onload = getTodos()

function getTodos()
{
    const apiAddress = 'https://localhost:7048/todolist'
    fetch(apiAddress)
    .then( res => res.json())
    .then( (data) => {
        let html = ``
        data.forEach(element => {
            console.log(element)
            html += generateItem(element)
        });
        document.getElementById('accordionExample').innerHTML = html
        })
    .catch( e => console.log(e))
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
}

function generateItem(obj)
{
    return `<div class="accordion-item" id="accordion${obj.id}">
    <h2 class="accordion-header">
        <div class="row align-items-center">
            <div class="col">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${obj.id}" aria-expanded="false" aria-controls="collapse${obj.id}">
                    <div class="col">
                        <strong>Title: </strong> ${obj.title}
                    </div>
                    <div class="col">
                        <strong>Status:</strong> ${obj.status}
                    </div>                
                </button>
            </div>
            <div class="col-1">
                <div class="col1 btn btn-primary" onclick="updateTodo(${obj.id})"> Update</div>
            </div>
            <div class="col-1">
                <div class="col1 btn btn-danger" onclick="deleteTodo(${obj.id})"> Delete</div>
            </div>
        </div>
    </h2>
    <div id="collapse${obj.id}" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
        <div class="accordion-body">
        <strong>Description:</strong> ${obj.description}
        </div>
    </div>
    </div>`
}

function generateForm(obj)
{
    return ``
}