import React from 'react';
import { HashRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import TodoList from '../views/todolist/list/index';
import TodoForm from '../views/todolist/form/';


export const Routes = () => <div className='container'>
  <Router>
    <Switch>      
      <Route exact path='/todo' component={TodoList} />
      <Route path='/todo/add' component={TodoForm} />
      <Route path='/todo/:id/edit' component={TodoForm} />
      <Route path='/todo/:id/view' component={TodoForm} />
      <Route exact path="/" render={() => (
        <Redirect to='/todo' />
      )} />
    </Switch>
  </Router>
</div>;