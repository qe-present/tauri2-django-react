import {configureStore} from '@reduxjs/toolkit'
import bookSlice from "./book-slice.jsx";
const store=configureStore({
    reducer:{
        book:bookSlice.reducer,
    }
})
export default store