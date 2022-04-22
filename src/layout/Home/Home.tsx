import React from 'react';
import Board from '../../component/board/Board';

const Home = () => {
    const [shipState, setShipState] = React.useState<Record<string, 'SHIP' | 'HIT' | 'DESTROYED' | 'MISSED'>>({});
    const handleOnclick = (element: string) => {
        setShipState((prevState) => ({ ...prevState, [element]: 'SHIP' }));
    };
    return <Board columns={['h', 'j', 'm']} rowsAmount={4} filedSituation={shipState} handleOnclick={handleOnclick} />;
};

export default Home;
