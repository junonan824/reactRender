'use client';

import dynamic from 'next/dynamic';

const TodoList = dynamic(() => import('./TodoList'), { ssr: false });

export default function ClientTodoList() {
  return <TodoList />;
} 