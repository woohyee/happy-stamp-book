import { useState } from 'react';
import CustomerView from './components/CustomerView.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';

function App() {
  // 어떤 화면을 보여줄지 결정하는 'view' 상태를 만듭니다. 기본값은 'customer'.
  const [view, setView] = useState('customer');

  return (
    <div style={{ padding: '20px' }}>
      {/* 화면 전환을 위한 네비게이션 버튼 */}
      <nav style={{ paddingBottom: '10px', borderBottom: '1.5px solid #eee', marginBottom: '20px' }}>
        <button onClick={() => setView('customer')} style={{ marginRight: '10px' }}>
          Customer View
        </button>
        <button onClick={() => setView('admin')}>
          Admin View
        </button>
      </nav>

      {/* view 상태에 따라 다른 컴포넌트를 보여줍니다. */}
      {view === 'customer' ? <CustomerView /> : <AdminDashboard />}
    </div>
  );
}

export default App;