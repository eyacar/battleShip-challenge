import React, { useMemo } from 'react';
import { useAppSelector } from './hook/reduxHooks';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Home from './layout/Home/Home';
import Match from './layout/match/Match';
import Rules from './layout/rules/Rules';
import RulesIcon from './asset/rules.png';

function App() {
    const playerName = useAppSelector((state) => state.user.userName);
    const routes = useMemo(() => {
        if (!playerName) {
            return (
                <>
                    <Route path='/' element={<Home />} />
                    <Route path='/*' element={<Navigate replace to='/' />} />
                </>
            );
        }
        return (
            <>
                <Route path='/play' element={<Match />} />
                <Route path='/*' element={<Navigate replace to='/play' />} />
            </>
        );
    }, [playerName]);
    return (
        <Router>
            <Link to='/rules' className='rules'>
                <img src={RulesIcon} alt='Rules' width='40px' />
            </Link>
            <h1 className='display-1 header'>Battle Ship Game</h1>
            <Routes>
                <Route path='/rules' element={<Rules />} />
                {routes}
            </Routes>
        </Router>
    );
}

export default App;
