import { createStore, combineReducers } from 'redux';
import { detailReducer } from './components/detail/reducer.detail';

export default createStore(
    combineReducers({
        detailReducer
    })
)
