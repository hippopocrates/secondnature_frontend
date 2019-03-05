import React, { Component } from 'react';
import HabitList from './components/HabitList.js'
import Forms from './components/Forms.js'
import './main.css'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentView: 'habits',
      completedHabits: [],
      wantingHabits: []
    }
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
    fetch('http//localhost:3000/habits/' + habit.id, {
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
  }

  render() {
    return (
      <React.Fragment>
        <div className="main-container">
          <h1>Hello Caroline!</h1>
          <Forms
            handleCreateHabit = {this.handleCreateHabit}
          />
          <h3>Morning Habits</h3>
            <HabitList />
          <h3>Afternoon Habits</h3>
            <HabitList />
          <h3>Evening Habits</h3>
            <HabitList />
        </div>
      </React.Fragment>
    );
  }
}

export default App;
