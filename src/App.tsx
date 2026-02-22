import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Home } from './pages/Home';
import { Recipes } from './pages/Recipes';
import { ShoppingListPage } from './pages/ShoppingList';
import { Settings } from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen pb-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/shopping" element={<ShoppingListPage />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
        <Navigation />
      </div>
    </BrowserRouter>
  );
}

export default App;
