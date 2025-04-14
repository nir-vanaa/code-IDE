import { useState } from 'react';
import { Button } from '@/components/ui/button';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="card">
      <Button onClick={() => setCount(c => c + 1)}>count is {count}</Button>
    </div>
  );
}

export default App;
