import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Colours, Typography } from '../definitions';
import Alert from '../components/Alert';
import PageLayout from '../components/PageLayout';
import Tabs from '../components/Tabs';
import TodoItem from '../components/TodoItem';
import { clearTodoAlerts, updateTodoError, updateTodoSuccess } from '../actions/todo';
import apiFetch from '../functions/apiFetch';
import { useDispatch, useSelector } from 'react-redux';

const Todos = () => {
    const [allTodos, setAllTodos] = useState([]);
    const [incompleteTodos, setIncompleteTodos] = useState([]);
    const [activeTab, setActiveTab] = useState("Incomplete Todos");
    const todoState = useSelector((state) => state.todo);
    const dispatch = useDispatch();

    // Fetch the list of todos from the backend
    const fetchTodos = async () => {
        const response = await apiFetch("/todo");
        const allTodos = response.body.sort((a, b) => new Date(b.created) - new Date(a.created));
        setAllTodos(allTodos);
    }

    // Update the todo with todoID with the updatedField, which can be name or done
    const handleUpdate = async (todoID, updatedField) => {
        dispatch(clearTodoAlerts());
        let response = await apiFetch(`/todo/${todoID}`, {
            method: "PATCH",
            body: updatedField,
        });
        if (response.status === 200) {
            dispatch(updateTodoSuccess({ success: "Todo updated successfully" }));
            const updatedTodos = allTodos.map(todo => (todo.todoID === todoID ? { ...todo, ...updatedField } : todo));
            setAllTodos(updatedTodos);
        }
        else {
            dispatch(updateTodoError({ error: response.body.error }));
        }
    };

    // Fetch todos from the backend when the component mounts
    useEffect(() => {
        fetchTodos();
    }, []);

    // Update incomplete todos when all todos change
    useEffect(() => {
        setIncompleteTodos(allTodos.filter(todo => !todo.done));
    }, [allTodos]);


    const tabData = [
        { title: "Incomplete Todos", todos: incompleteTodos },
        { title: "All Todos", todos: allTodos },
    ];
    const tabs = tabData.map(({ title, todos }) => ({
        title,
        content: (
            <ul>
                {todos.map(todo => (
                    <li key={todo.todoID}>
                        <TodoItem
                            todo={todo}
                            onUpdate={(todoID, updatedField) => { handleUpdate(todoID, updatedField) }}
                        />
                    </li>
                ))}
            </ul>
        ),
        onClick: () => setActiveTab(title)
    }));

    return (
        <PageLayout title="Todos">
            <Container>
                <div className="content">
                    <h1>Todos</h1>
                    <Alert message={todoState.alerts.error} onClose={() => dispatch(clearTodoAlerts())} />
                    <Alert message={todoState.alerts.success} onClose={() => dispatch(clearTodoAlerts())} variant="success" />
                    <Tabs tabs={tabs} activeTab={activeTab} />
                </div>
                <div className="footnote">
                    *Todos are sorted by the most recent creation date first.
                    Click on the name to edit it,
                    and toggle the switch on the right to update the completion status.
                </div>
            </Container>
        </PageLayout>
    );
};

export default Todos;

const Container = styled.div`
    width: 100%;

    .content {
        h1 {
            color: ${Colours.BLACK};
            font-size: ${Typography.HEADING_SIZES.M};
            font-weight: ${Typography.WEIGHTS.LIGHT};
            line-height: 2.625rem;
            margin-bottom: 2rem;
            margin-top: 1rem;
        }
    }

    .footnote {
        color: ${Colours.BLACK_LIGHTER};
        font-size: ${Typography.BODY_SIZES.S};
        margin-top: 1rem;
    }
`;