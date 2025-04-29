//when my dom is loaded, I want to get the input field, add task button, todo list
document.addEventListener('DOMContentLoaded', () => { //when the page is loaded, this function will be called
    const todoInput = document.getElementById("input-field");
    const addTaskBtn = document.getElementById("add-task-btn");
    const todoList = document.getElementById("tlist");

    //local storage gives string , convert it to original data type (array)
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];//getting the tasks from local storage from same key;
    //if tasks is null, then set it to empty array

    //display tasks from local storage
    tasks.forEach(task => { //nice loop for array
        renderTasks(task);
    })

    addTaskBtn.addEventListener("click", () => {
        const taskText = todoInput.value.trim();//remove spaces
        if (taskText === "") return;

        const newTask = {
            id: Date.now(),//add unique id, so that we can delete the task 
            text: taskText,
            isCompleted: false
        }
        tasks.push(newTask);
        saveTasks(); //going to save tasks to local storage
        renderTasks(newTask);

        todoInput.value = "";//clear input field
    })




    //save tasks to local storage
    function saveTasks() {
        //push tasks to local storage
        //browser have api to store data locally
        //localstorage setitem: can only store string wrt key(any type)
        localStorage.setItem("tasks", JSON.stringify(tasks)); //convert array to string(special type(sructure should remain same))
        //JSON.stringify: convert array to string
        //JSON.parse: convert string to original data type
    }

    //read tasks from local storage
    function renderTasks(task) {
        const li = document.createElement("li");
        li.setAttribute('data-id',task.id); //key value pair
        if(task.isCompleted) li.classList.add("completed");
        li.innerHTML=`
        <span>${task.text}</span>
        <button>delete</button>
        `; 
        li.addEventListener("click",(e)=>{
            if(e.target.tagName==="BUTTON") return; //for now not caring about button
            task.isCompleted = !task.isCompleted;
            li.classList.toggle("completed");// add or remove class completed(for css)
            saveTasks(); //some properties are modified, so save it
        })
        //just puuting particular event listener for button inside li
        li.querySelector("button").addEventListener("click",(e)=>{
            e.stopPropagation(); //stop event bubbling,default behaviour, event can go to parent,prevent toggle from firing
            tasks=tasks.filter(t=>t.id!==task.id); //filter out the task without the id, t:each task(like a loop)
            li.remove(); //remove the task from the dom
            if(tasks.length==0) localStorage.removeItem("tasks"); //remove the tasks from local storage if no tasks are present
            else  saveTasks(); //save the tasks


        })
        
        todoList.appendChild(li);
    }


})