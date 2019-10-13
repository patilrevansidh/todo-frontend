import React from 'react';
import { connect } from 'react-redux';
import './App.css';
import { fetchBuckets, fetchingTodos } from './app/views/todolist/action/actions';
import TodoForm from './app/views/todolist/form';
import TodoList from './app/views/todolist/list/index';
class App extends React.Component {
  componentDidMount() {
    const { fetchBuckets, fetchingTodos } = this.props;
    fetchBuckets();
    fetchingTodos();
  }

  render() {
    return (
      <div className="container">
        <TodoForm />
        <TodoList />
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  fetchBuckets: () => {
    dispatch(fetchBuckets());
  },
  fetchingTodos: () => {
    dispatch(fetchingTodos());
  }
});

export default connect(null, mapDispatchToProps)(App);
