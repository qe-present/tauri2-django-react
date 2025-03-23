// App.jsx
import { RouterProvider } from 'react-router';
import router from './router/index.jsx';
import {queryClient} from "./utils/getBook.jsx";
import {QueryClientProvider} from "@tanstack/react-query";



function App() {

    return (
        <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
        </QueryClientProvider>
    );
}

export default App;