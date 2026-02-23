import { HashRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Sidebar } from './components/Sidebar';
import { UpdateNotification } from './components/UpdateNotification';
import { Home } from './pages/Home';
import { Recipes } from './pages/Recipes';
import { ShoppingListPage } from './pages/ShoppingList';
import { Settings } from './pages/Settings';

function App() {
  return (
    <HashRouter>
      <UpdateNotification />
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 lg:pb-0 pb-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/shopping" element={<ShoppingListPage />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>

        {/* Mobile Bottom Navigation */}
        <Navigation />
      </div>
    </HashRouter>
  );
}

export default App;
