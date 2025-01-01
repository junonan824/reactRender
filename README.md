# Todo List 컴포넌트 예제

이 프로젝트는 [Next.js](https://nextjs.org)와 [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app)으로 생성되었습니다.

## 시작하기

개발 서버를 실행하세요:

```bash
npm run dev
# 또는
yarn dev
# 또는
pnpm dev
# 또는
bun dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)를 열어 결과를 확인하세요.

## React 컴포넌트 생명주기 메서드

### 마운트 (Mounting)
컴포넌트가 생성되고 DOM에 삽입될 때 실행되는 메서드들:

1. **constructor()**
   - 컴포넌트가 초기화될 때 호출
   - 초기 state를 설정하는 데 사용
   ```javascript
   constructor(props) {
     super(props);
     this.state = { todos: [] };
   }
   ```

2. **componentDidMount()**
   - 컴포넌트가 DOM에 마운트된 후 호출
   - API 호출, 구독 설정, DOM 조작에 적합
   ```javascript
   componentDidMount() {
     // API에서 초기 할일 목록 가져오기
     fetch('https://jsonplaceholder.typicode.com/todos')
       .then(response => response.json())
       .then(data => this.setState({ todos: data }));
   }
   ```

### 업데이트 (Updating)
props나 state가 변경되어 컴포넌트가 다시 렌더링될 때:

1. **componentDidUpdate(prevProps, prevState)**
   - 컴포넌트 업데이트 후 호출
   - props/state 변경에 대응하기 좋음
   ```javascript
   componentDidUpdate(prevProps, prevState) {
     if (prevState.todos.length !== this.state.todos.length) {
       console.log('할일 목록이 변경되었습니다!');
     }
   }
   ```

### 언마운트 (Unmounting)
컴포넌트가 DOM에서 제거될 때:

1. **componentWillUnmount()**
   - 컴포넌트가 제거되기 직전에 호출
   - 이벤트 리스너 제거, 네트워크 요청 취소 등 정리 작업에 사용
   ```javascript
   componentWillUnmount() {
     console.log('컴포넌트가 제거됩니다');
     // 구독 해제, 타이머 정리 등
   }
   ```

## TodoList 컴포넌트 예제

우리의 TodoList 컴포넌트는 다음과 같은 생명주기 메서드를 보여줍니다:

```typescript
class TodoList extends Component {
  // 마운트 시 API에서 데이터 가져오기
  componentDidMount() {
    fetch('https://jsonplaceholder.typicode.com/todos')
      .then(response => response.json())
      .then(data => this.setState({ todos: data }));
  }

  // 컴포넌트 제거 시 정리
  componentWillUnmount() {
    console.log('TodoList 컴포넌트가 제거됩니다');
  }
}
```

## 모범 사례

1. `componentDidMount`의 사용:
   - API 호출
   - 구독 설정
   - DOM 조작

2. `componentDidUpdate`의 사용:
   - props/state 변경에 대한 응답
   - props 변경에 따른 네트워크 요청
   - state/props 변경 후 DOM 업데이트

3. `componentWillUnmount`의 사용:
   - 구독 해제
   - 네트워크 요청 취소
   - 이벤트 리스너 제거

4. 메모리 누수 방지를 위해 `componentWillUnmount`에서 항상 정리 작업 수행

## Vercel에 배포하기

Next.js 앱을 배포하는 가장 쉬운 방법은 Next.js 제작자가 만든 [Vercel 플랫폼](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)을 사용하는 것입니다.

자세한 내용은 [Next.js 배포 문서](https://nextjs.org/docs/app/building-your-application/deploying)를 참조하세요.
