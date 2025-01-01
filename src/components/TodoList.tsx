import React, { Component } from 'react';
import './TodoList.css';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
}

interface TodoListState {
  todos: Todo[];
  newTodoText: string;
  isLoading: boolean;
  filter: 'all' | 'active' | 'completed';
  searchTerm: string;
  darkMode: boolean;
}

class TodoList extends Component<Record<never, never>, TodoListState> {
  private abortController: AbortController | null = null;
  private intervalId: NodeJS.Timeout | null = null;
  private searchDebounceTimer: NodeJS.Timeout | null = null;
  private resizeObserver: ResizeObserver | null = null;

  constructor(props: Record<never, never>) {
    super(props);
    this.state = {
      todos: [],
      newTodoText: '',
      isLoading: false,
      filter: 'all',
      searchTerm: '',
      darkMode: false
    };
  }

  componentDidMount() {
    console.log('컴포넌트 마운트됨');
    
    // 1. API 호출
    this.fetchTodos();

    // 2. 로컬 스토리지에서 데이터 복원
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      this.setState({ todos: JSON.parse(savedTodos) });
    }

    // 3. 다크모드 감지 이벤트 리스너
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.handleDarkModeChange(darkModeMediaQuery);
    darkModeMediaQuery.addListener(this.handleDarkModeChange);

    // 4. 컴포넌트 크기 변경 감지
    this.resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        console.log('컴포넌트 크기 변경:', entry.contentRect);
      }
    });

    const todoListElement = document.querySelector('.todo-list');
    if (todoListElement) {
      this.resizeObserver.observe(todoListElement);
    }

    // 5. 주기적 데이터 갱신
    this.intervalId = setInterval(this.fetchTodos, 300000);
  }

  componentDidUpdate(prevProps: Record<never, never>, prevState: TodoListState) {
    // 1. todos 변경 시 로컬 스토리지 업데이트
    if (prevState.todos !== this.state.todos) {
      localStorage.setItem('todos', JSON.stringify(this.state.todos));
    }

    // 2. 검색어 변경 시 디바운스 처리
    if (prevState.searchTerm !== this.state.searchTerm) {
      if (this.searchDebounceTimer) {
        clearTimeout(this.searchDebounceTimer);
      }
      this.searchDebounceTimer = setTimeout(this.handleSearch, 500);
    }

    // 3. 다크모드 변경 시 스타일 업데이트
    if (prevState.darkMode !== this.state.darkMode) {
      document.body.classList.toggle('dark-mode', this.state.darkMode);
    }
  }

  componentWillUnmount() {
    console.log('컴포넌트 언마운트됨');

    // 1. 타이머 정리
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }

    // 2. 네트워크 요청 취소
    if (this.abortController) {
      this.abortController.abort();
    }

    // 3. ResizeObserver 정리
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    // 4. 로컬 스토리지 최종 저장
    localStorage.setItem('todos', JSON.stringify(this.state.todos));
  }

  handleDarkModeChange = (e: MediaQueryListEvent | MediaQueryList) => {
    this.setState({ darkMode: e.matches });
  };

  handleSearch = () => {
    console.log('검색 실행:', this.state.searchTerm);
    // 검색 로직 구현
  };

  handleFilterChange = (filter: TodoListState['filter']) => {
    this.setState({ filter });
  };

  handleTodoPriorityChange = (todoId: number, priority: Todo['priority']) => {
    this.setState(prevState => ({
      todos: prevState.todos.map(todo =>
        todo.id === todoId ? { ...todo, priority } : todo
      )
    }));
  };

  handleTodoToggle = (todoId: number) => {
    this.setState(prevState => ({
      todos: prevState.todos.map(todo =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
      )
    }));
  };

  getFilteredTodos = () => {
    const { todos, filter, searchTerm } = this.state;
    return todos
      .filter(todo => {
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true;
      })
      .filter(todo =>
        todo.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
  };

  fetchTodos = async () => {
    this.setState({ isLoading: true });

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos');
      const data = await response.json();
      this.setState({ 
        todos: data.slice(0, 10),
        isLoading: false
      });
    } catch (error) {
      console.error('Error fetching todos:', error);
      this.setState({ isLoading: false });
    }
  };

  render() {
    const filteredTodos = this.getFilteredTodos();

    return (
      <div className={`todo-list ${this.state.darkMode ? 'dark' : ''}`}>
        <div className="todo-controls">
          <form onSubmit={this.handleAddTodo}>
            <input
              type="text"
              value={this.state.newTodoText}
              onChange={this.handleInputChange}
              placeholder="새로운 할일을 입력하세요"
            />
          </form>

          <input
            type="text"
            value={this.state.searchTerm}
            onChange={e => this.setState({ searchTerm: e.target.value })}
            placeholder="할일 검색..."
          />

          <div className="filters">
            <button 
              className={this.state.filter === 'all' ? 'active' : ''}
              onClick={() => this.handleFilterChange('all')}
            >
              전체
            </button>
            <button 
              className={this.state.filter === 'active' ? 'active' : ''}
              onClick={() => this.handleFilterChange('active')}
            >
              진행중
            </button>
            <button 
              className={this.state.filter === 'completed' ? 'active' : ''}
              onClick={() => this.handleFilterChange('completed')}
            >
              완료
            </button>
          </div>
        </div>

        {this.state.isLoading ? (
          <div className="loading">로딩 중...</div>
        ) : (
          <ul>
            {filteredTodos.map(todo => (
              <li 
                key={todo.id}
                className={todo.completed ? 'completed' : ''}
                data-priority={todo.priority || 'low'}
                onClick={() => this.handleTodoToggle(todo.id)}
              >
                <span>{todo.title}</span>
                <select
                  value={todo.priority || 'low'}
                  onChange={e => this.handleTodoPriorityChange(todo.id, e.target.value as Todo['priority'])}
                  onClick={e => e.stopPropagation()}
                >
                  <option value="low">낮음</option>
                  <option value="medium">중간</option>
                  <option value="high">높음</option>
                </select>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}

export default TodoList; 