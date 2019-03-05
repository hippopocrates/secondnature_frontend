import React, { Component } from "react";

class Habit extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="Habit">
          <div className="habit-item slide-in-blurred-left">{this.props.habit.habit_item}
            <div className="habit-item-buttons-div">
                {this.props.habit.completed === false
                  ? <i
                    class="fas fa-check-circle"
                    onClick={() => {
                      this.props.handleCheck(
                        this.props.habit,
                        this.props.arrayIndex,
                        this.props.currentArray
                      )
                    }}></i>
                  : <i
                    class="fas fa-history"
                    onClick={() => {
                      this.props.handleCheck(
                        this.props.habit,
                        this.props.arrayIndex,
                        this.props.currentArray
                      )
                    }}></i>}
                <i
                  class="fas fa-trash"
                  onClick={() => {
                    this.props.handleDelete(
                      this.props.habit.id,
                      this.props.arrayIndex,
                      this.props.currentArray
                    )
                  }}></i>

            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default Habit;
