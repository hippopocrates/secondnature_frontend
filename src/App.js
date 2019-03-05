import React, { Component } from "react";
import HabitList from "./components/HabitList.js";
import Forms from "./components/Forms.js";
import DateHeader from "./components/DateHeader.js";
import "./main.css";
import ls from "local-storage";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentView: "",
      completedHabits: [],
      wantingHabits: [],
      currentMonth: "",
      currentDay: "",
      currentYear: ""
    };
  }
  //-------------------------------//
  //  HANDLE VIEW OF HABITS LISTS  //
  //-------------------------------//
  handleView = view => {
    this.setState({ currentView: view });
  };

  //-------------------------//
  //  RETRIEVE CURRENT DATE  //
  //-------------------------//
  getDate = () => {
    let currentDay = new Date().toJSON().slice(8, 10);
    let currentMonth = new Date().toJSON().slice(5, 7);
    let currentYear = new Date().toJSON().slice(0, 4);
    let fullDate = currentMonth + "/" + currentDay + "/" + currentYear;
    this.setState({
      currentView: fullDate,
      currentDay: currentDay,
      currentMonth: currentMonth,
      currentYear: currentYear
    });
  };

  //---------------------//
  //  CHANGE HABIT DATE  //
  //---------------------//
  previousDay = () => {
    let prevDay =
      this.state.currentDay - 1 >= 1 ? this.state.currentDay - 1 : 30;
    let fullDate =
      this.state.currentMonth + "/" + prevDay + "/" + this.state.currentYear;
    this.setState({
      currentDay: prevDay,
      currentView: fullDate
    });
  };
  nextDay = () => {
    let nextDay =
      this.state.currentDay + 1 <= 30 ? this.state.currentDay + 1 : 1;
    this.setState({
      currentDay: nextDay
    });
  };

  fetchHabits = () => {
    fetch("http://localhost:3000/habits")
      .then(response => response.json())
      .then(jsonData => {
        this.sortHabits(jsonData);
      })
      .catch(error => console.log(error));
  };

  //-------------------//
  //  UPDATES A HABIT  //
  //-------------------//
  handleCheck = (habit, arrayIndex, currentArray) => {
    habit.completed = !habit.completed;
    console.log(habit);
    fetch("http://localhost:3000/habits/" + habit.id, {
      body: JSON.stringify(habit),
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
      }
    })
      .then(updatedHabit => {
        return updatedHabit.json();
      })
      .then(jsonData => {
        this.removeFromArray(currentArray, arrayIndex);
        if (currentArray === "wantingHabits") {
          this.updateArray(habit, "completedHabits");
        } else {
          this.updateArray(habit, "wantingHabits");
        }
      });
  };

  //---------------------------//
  //  REMOVE HABIT FROM ARRAY  //
  //---------------------------//
  removeFromArray = (array, arrayIndex) => {
    this.setState(prevState => {
      prevState[array].splice(arrayIndex, 1);
      return {
        [array]: prevState[array]
      };
    });
  };

  //Update the state of array
  updateArray = (habit, array) => {
    this.setState(prevState => {
      prevState[array].push(habit);
      console.log(prevState);
      return {
        [array]: prevState[array]
      };
    });
  };

  sortHabits = habits => {
    let completedHabits = [];
    let wantingHabits = [];
    habits.forEach(habit => {
      if (habit.completed) {
        completedHabits.push(habit);
      } else {
        wantingHabits.push(habit);
      }
    });
    this.setHabits(completedHabits, wantingHabits);
  };

  setHabits = (completed, wanting) => {
    this.setState({
      completedHabits: completed,
      wantingHabits: wanting
    });
  };

  //-------------------//
  //  MOUNT COMPONENT  //
  //-------------------//
  componentDidMount() {
    this.fetchHabits();
    this.getDate();
  }

  render() {
    return (
      <React.Fragment>
        <div className="main-container">
          <h1>Second Nature</h1>
          <h5>Tracking your daily habits to help you live your best life!</h5>
          <Forms handleCreateHabit={this.handleCreateHabit} />
          <DateHeader
            day={this.state.currentDay}
            month={this.state.currentMonth}
            year={this.state.currentYear}
            previousDay={this.previousDay}
            nextDay={this.nextDay}
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
