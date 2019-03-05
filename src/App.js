import React, { Component } from 'react';
import HabitList from './components/HabitList.js'
import Forms from './components/Forms.js'
import DateHeader from './components/DateHeader.js'
import './main.css'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentView: 'all-habits',
      completedHabits: [],
      wantingHabits: [],
      currentMonth: '',
      currentDay: '',
      currentYear: ''
    }
  }
  //-------------------------------//
  //  HANDLE VIEW OF HABITS LISTS  //
  //-------------------------------//
  handleView = (view) => {
    this.setState({ currentView: view })
  }

  //-------------------------//
  //  RETRIEVE CURRENT DATE  //
  //-------------------------//
  getDate = () => {
    let currentDay = new Date().toJSON().slice(8,10)
    let currentMonth = new Date().toJSON().slice(5,7)
    let currentYear = new Date().toJSON().slice(0,4)
    this.setState({
      currentDay: currentDay,
      currentMonth: currentMonth,
      currentYear: currentYear
    })
  }

  //-------------------------//
  //  FETCH HABITS FROM API  //
  //-------------------------//
  fetchHabits = () => {
    fetch('http://localhost:3000/habits')
    .then(response => response.json())
    .then(jsonData => {
      this.sortHabits(jsonData)
    })
    .catch(error => console.log(error))
  }

  //----------------------//
  //  CREATE A NEW HABIT  //
  //----------------------//
  handleCreateHabit = (habit) => {
    fetch('http://localhost:3000/habits', {
      body: JSON.stringify(habit),
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
    })
    .then(createdHabit => {
      return createdHabit.json()
    })
    .then(jsonData => {
      this.updateArray(jsonData, 'wantingHabits')
    })
    .catch(error => console.log(error))
  }

  //-------------------//
  //  DELETES A HABIT  //
  //-------------------//
  //Need to figure out how to delete from either array regardless of where the data is located
  handleDelete = (habitId, arrayIndex, currentArray) => {
    fetch('http://localhost:3000/habits/' + habitId, {
      method: 'DELETE'
    })
    .then(data => {
      this.removeFromArray(currentArray, arrayIndex)
    })
    .catch(error => console.log(error))
  }

  //-------------------//
  //  UPDATES A HABIT  //
  //-------------------//
  handleCheck = (habit, arrayIndex, currentArray) => {
    habit.completed = !habit.completed
    console.log(habit)
    fetch('http://localhost:3000/habits/' + habit.id, {
      body: JSON.stringify(habit),
      method: 'PUT',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
    })
    .then(updatedHabit => {
      return updatedHabit.json()
    })
    .then(jsonData => {
      this.removeFromArray(currentArray, arrayIndex)
      if(currentArray === 'wantingHabits') {
        this.updateArray(habit, 'completedHabits')
      } else {
        this.updateArray(habit, 'wantingHabits')
      }
    })
  }

  //---------------------------//
  //  REMOVE HABIT FROM ARRAY  //
  //---------------------------//
  removeFromArray = (array, arrayIndex) => {
    this.setState(prevState => {
      prevState[array].splice(arrayIndex, 1)
      return {
        [array]: prevState[array]
      }
    })
  }

  //--------------------------//
  //  UPDATE ARRAY WITH HABIT //
  //--------------------------//
  updateArray = (habit, array) => {
    this.setState(prevState => {
      prevState[array].push(habit)
      console.log(prevState)
      return {
        [array]: prevState[array]
      }
    })
  }

  //----------------------------------//
  //  SORT HABITS: COMPLETED/WANTING  //
  //----------------------------------//
  sortHabits = (habits) => {
    let completedHabits = []
    let wantingHabits = []
    habits.forEach((habit) => {
      if(habit.completed) {
        completedHabits.push(habit)
      } else {
        wantingHabits.push(habit)
      }
    })
    this.setHabits(completedHabits, wantingHabits)
  }

  //--------------//
  //  SET HABITS  //
  //--------------//
  setHabits = (completed, wanting) => {
    this.setState({
      completedHabits: completed,
      wantingHabits: wanting
    })
  }

  //-------------------//
  //  MOUNT COMPONENT  //
  //-------------------//
  componentDidMount () {
    this.fetchHabits()
    this.getDate()
  }

  render() {
    return (
      <React.Fragment>
        <div className="main-container">
          <h1>Second Nature</h1>
          <h5>Tracking your daily habits to help you live your best life!</h5>
          <Forms
            handleCreateHabit = {this.handleCreateHabit}
          />
          <DateHeader
            day={this.state.currentDay}
            month={this.state.currentMonth}
            year={this.state.currentYear}
          />
          <h3>Habits for Today</h3>
            <HabitList
              wantingHabits={this.state.wantingHabits}
              completedHabits={this.state.completedHabits}
              handleCheck={this.handleCheck}
              handleDelete={this.handleDelete}
              currentView={this.state.currentView}
            />
        </div>
      </React.Fragment>
    );
  }
}

export default App;
