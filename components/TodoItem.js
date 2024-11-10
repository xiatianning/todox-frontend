import React, { useState } from 'react';
import styled from 'styled-components';
import { Typography, Colours } from '../definitions';

const TodoItem = ({ todo, onUpdate }) => {
    const { name, todoID, created, done } = todo;
    const formattedDate = new Date(created).toLocaleString();
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(name);

    // Handle toggle done state
    const handleToggleDone = () => {
        onUpdate(todoID, { done: !done });
    };

    // Handle edit name
    const handleEditName = (e) => {
        setIsEditing(false);
        onUpdate(todoID, { name: newName });
    };

    // Handle name change in input field
    const handleNameChange = (e) => {
        // Not accepting empty input
        // A possbile area of improvement to show an error message
        const value = e.target.value;
        if (value.trim() !== "") {
            setNewName(value);
        }
    };

    return (
        <Container className="todoContainer">
            <div className="leftContainer">
                {isEditing ? (
                    <input // A possbile area of improvement to make it resizable to fit long names
                        type="text"
                        className="todoNameEditable"
                        value={newName}
                        onChange={handleNameChange}
                        onBlur={handleEditName} // Save name when the input loses focus
                        autoFocus
                    />
                ) : (
                    <h3 className="todoName" onClick={() => setIsEditing(true)}>
                        {name}
                    </h3>
                )}
                <span className="todoDate">{formattedDate}</span>
            </div>
            <div className="rightContainer">
                <label className="switch">
                    <input
                        type="checkbox"
                        checked={done}
                        onChange={handleToggleDone}
                    />
                    <span className="slider round"></span>
                </label>
                <span className="switchText">Done</span>
            </div>
        </Container>
    );
};

// Styled Components for layout
const Container = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid ${Colours.GRAY_LIGHT};

    .leftContainer {
        display: flex;
        flex-direction: column;
        text-align: left;
    }

    .rightContainer {
        display: flex;
        align-items: center;
        margin-left: 2px;
    }

    .todoName {
        font-size: ${Typography.BODY_SIZES.L};
        cursor: pointer;
    }
    
    .todoNameEditable {
        font-size: ${Typography.BODY_SIZES.L};
        width: auto;
    }
    
    .todoDate {
        font-size: ${Typography.BODY_SIZES.S};
        color: ${Colours.BLACK_LIGHTER};
        margin-top: 6px;
    }

    .switch {
        position: relative;
        display: inline-block;
        width: 34px;
        height: 20px;
        margin: 6px
    }

    .switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: ${Colours.BLACK_LIGHTEST_2};
        transition: 0.4s;
        border-radius: 50px;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 12px;
        width: 12px;
        border-radius: 50%;
        left: 4px;
        bottom: 4px;
        background-color: ${Colours.WHITE};
        transition: 0.4s;
    }

    input:checked + .slider {
        background-color: ${Colours.PRIMARY_DARK};
    }

    input:checked + .slider:before {
        transform: translateX(14px);
    }

    .switchText {
        font-size: ${Typography.BODY_SIZES.S};
        color: ${Colours.PRIMARY_DARK};
    }
`;

export default TodoItem;