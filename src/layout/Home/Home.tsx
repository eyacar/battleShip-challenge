import React from 'react';
import Board from '../../component/board/Board';
import { useAppDispatch } from '../../hook/reduxHooks';
import { addPlayerFieldState } from '../../store/board/';

const Home = () => {
    const dispatch = useAppDispatch();
    const handleOnclick = (element: string) => {
        dispatch(addPlayerFieldState({ fieldName: element, fieldState: 'HIT' }));
    };
    return <Board columns={['h', 'j', 'm']} rowsAmount={4} handleOnclick={handleOnclick} isPlayer />;
};

export default Home;
