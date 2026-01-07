import React, { createContext, useContext, useReducer, useCallback } from 'react';
import * as chatAPI from '../api/chat.api.js';

// Simple reducer for chat since one didn't exist in the list I saw, 
// or I can standardise it here.
const chatActions = {
    FETCH_CONVERSATIONS_START: 'FETCH_CONVERSATIONS_START',
    FETCH_CONVERSATIONS_SUCCESS: 'FETCH_CONVERSATIONS_SUCCESS',
    FETCH_CONVERSATIONS_FAILURE: 'FETCH_CONVERSATIONS_FAILURE',
    SEND_MESSAGE_START: 'SEND_MESSAGE_START',
    SEND_MESSAGE_SUCCESS: 'SEND_MESSAGE_SUCCESS',
    SEND_MESSAGE_FAILURE: 'SEND_MESSAGE_FAILURE',
};

const chatReducer = (state, action) => {
    switch (action.type) {
        case chatActions.FETCH_CONVERSATIONS_START:
            return { ...state, isLoading: true, error: null };
        case chatActions.FETCH_CONVERSATIONS_SUCCESS:
            return { ...state, conversations: action.payload, isLoading: false };
        case chatActions.FETCH_CONVERSATIONS_FAILURE:
            return { ...state, isLoading: false, error: action.payload };
        // Add send message handlers as needed
        default:
            return state;
    }
};

const ChatContext = createContext(null);

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) throw new Error('useChat must be used within a ChatProvider');
    return context;
};

export const ChatProvider = ({ children }) => {
    const [state, dispatch] = useReducer(chatReducer, {
        conversations: [],
        isLoading: false,
        error: null,
    });

    const fetchConversations = useCallback(async () => {
        dispatch({ type: chatActions.FETCH_CONVERSATIONS_START });
        try {
            const response = await chatAPI.getCitizenConversations();
            if (response.success) {
                dispatch({ type: chatActions.FETCH_CONVERSATIONS_SUCCESS, payload: response.data });
            } else {
                dispatch({ type: chatActions.FETCH_CONVERSATIONS_FAILURE, payload: response.message });
            }
        } catch (error) {
            dispatch({ type: chatActions.FETCH_CONVERSATIONS_FAILURE, payload: error.message });
        }
    }, []);

    // Can extend with sendMessage, etc.

    const value = {
        conversations: state.conversations,
        isLoading: state.isLoading,
        error: state.error,
        fetchConversations,
    };

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
