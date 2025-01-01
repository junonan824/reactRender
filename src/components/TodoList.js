import React, { Component } from 'react';
import './TodoList.css';

class TodoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: [],
      newTodoText: ''
    };
  }

  componentDidMount() {
    console.log('Fetching todos...');
    fetch('https://jsonplaceholder.typicode.com/todos')
      .then(response => response.json())
      .then(data => {
        this.setState({ 
          todos: data.slice(0, 10) // Limiting to 10 items for demonstration
        });
      })
      .catch(error => console.error('Error fetching todos:', error));
  }

  componentWillUnmount() {
    console.log('TodoList component unmounting');
    // Clean up any console logs or subscriptions here
  }

  handleInputChange = (e) => {
    this.setState({ newTodoText: e.target.value });
  }

  handleAddTodo = (e) => {
    e.preventDefault();
    if (!this.state.newTodoText.trim()) return;

    const newTodo = {
      id: Date.now(),
      title: this.state.newTodoText,
      completed: false
    };

    this.setState(prevState => ({
      todos: [...prevState.todos, newTodo],
      newTodoText: ''
    }));
  }

  render() {
    return (
      <div className="todo-list">
        <h2>Todo List</h2>
        
        <form onSubmit={this.handleAddTodo}>
          <input
            type="text"
            value={this.state.newTodoText}
            onChange={this.handleInputChange}
            placeholder="Add new todo"
          />
          <button type="submit">Add Todo</button>
        </form>

        <ul>
          {this.state.todos.map(todo => (
            <li key={todo.id}>
              {todo.title}
              {todo.completed && ' ✓'}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default TodoList; 