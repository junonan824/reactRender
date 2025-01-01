'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const TodoList = dynamic(() => import('./TodoList'), { ssr: false });

export default function ClientTodoList() {
  const [showTodoList, setShowTodoList] = useState(true);

  return (
    <div>
      <button 
        onClick={() => setShowTodoList(!showTodoList)}
        style={{
          marginBottom: '20px',
          padding: '8px 16px',
          backgroundColor: showTodoList ? '#ff4444' : '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        {showTodoList ? '할일 목록 제거' : '할일 목록 표시'}
      </button>
      {showTodoList && <TodoList />}
    </div>
  );
} 