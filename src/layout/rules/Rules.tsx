import React from 'react';
import { useAppSelector } from '../../hook/reduxHooks';
import { Link } from 'react-router-dom';

const Rules = () => {
    const playerName = useAppSelector((state) => state.user.userName);
    return (
        <div style={{ marginLeft: '10px' }} data-testid='rules'>
            <h1>Rules</h1>
            <ol>
                <li>Select you ships</li>
                <li>Add you Name and Start the match</li>
                <li>When you are on a match and is your turn click one field of the CPU board in order to make you play</li>
            </ol>
            <Link to='/' className='btn btn-outline-primary' data-testid='navigate button'>
                {playerName ? 'Go To match' : 'Go Home'}
            </Link>
        </div>
    );
};

export default Rules;
