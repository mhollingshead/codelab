import './App.scss';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Whiteboard from './pages/Whiteboard';

export default function App() {
  return (
    <BrowserRouter>
      <Switch>
        {/* <Route path="/home" exact /> */}
        {/* <Route path="/login" exact /> */}
        {/* <Route path="/signup" exact /> */}
        <Route path="/" exact component={Whiteboard} />
        <Route path="/:id" component={Whiteboard} />
      </Switch>
    </BrowserRouter>
  );
}
