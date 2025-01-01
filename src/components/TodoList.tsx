import React, { Component } from 'react';
import './TodoList.css';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

interface TodoListState {
  todos: Todo[];
  newTodoText: string;
}

class TodoList extends Component<Record<never, never>, TodoListState> {
  constructor(props: Record<never, never>) {
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
          todos: data.slice(0, 10)
        });
      })
      .catch(error => console.error('Error fetching todos:', error));
  }

  componentWillUnmount() {
    console.log('TodoList component unmounting');
  }

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newTodoText: e.target.value });
  }

  handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!this.state.newTodoText.trim()) return;

    const newTodo: Todo = {
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
        <form onSubmit={this.handleAddTodo}>
          <input
            type="text"
            value={this.state.newTodoText}
            onChange={this.handleInputChange}
            placeholder="Add new todo"
          />
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