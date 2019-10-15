import React from 'react';
import { connect } from 'react-redux';
import './App.scss';
import { fetchBuckets, fetchingTodos } from './app/views/todolist/action/actions';
// import TodoForm from './app/views/todolist/form';
// import TodoList from './app/views/todolist/list/index';
import { Routes } from './app/config/routes';
class App extends React.Component {
  componentDidMount() {
    const { fetchBuckets, fetchingTodos } = this.props;
    fetchBuckets();
    fetchingTodos();
  }

  render = () => <Routes/>
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
