import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {AuthProvider} from './contexts/AuthContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AuthProvider>
            <App/>
        </AuthProvider>
    </React.StrictMode>
);


// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App.tsx';
// import { AuthProvider } from './contexts/AuthContext.tsx';
//
// function MainComponent() {
//     return (
//         <React.StrictMode>
//             <AuthProvider>
//                 <App />
//             </AuthProvider>
//         </React.StrictMode>
//     );
// }
ReactDOM.createRoot(document.getElementById('root')!).render(<MainComponent />);