import { Router, Route } from '@solidjs/router';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Help from './pages/Help';
import About from './pages/About';
import History from './pages/History';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router root={Layout}>
      <Route path="/" component={Dashboard} />
      <Route path="/login" component={Login} />
      <Route path="/help" component={Help} />
      <Route path="/about" component={About} />
      <Route path="/history" component={History} />
      <Route path="*" component={NotFound} />
    </Router>
  );
}

export default App;
