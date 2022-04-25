import React, { useMemo } from 'react';
import Board from '../../component/board/Board';
import { useAppDispatch } from '../../hook/reduxHooks';
import { addPlayerFieldState } from '../../store/board/';
import useSelection from '../../hook/useShipSelection';

const Home = () => {
    const dispatch = useAppDispatch();
    const { handleOpenSelectionModal, modal, selection, addWarning, shipIsSelected } = useSelection();
    const handleOnclick = (element: string) => {
        dispatch(addPlayerFieldState({ fieldName: element, fieldState: 'HIT' }));
    };
    console.log(selection);
    const selectionButton = useMemo(() => {
        if (selection === 'No More Ships to select') {
            return addWarning;
        } else {
            return (
                <>
                    <span onClick={handleOpenSelectionModal}>+</span> {addWarning}
                </>
            );
        }
    }, [selection, addWarning, handleOpenSelectionModal]);

    return (
        <>
            {modal}
            {selectionButton}
            {selection !== 'No More Ships to select' && <span onClick={shipIsSelected}>Selected</span>}
            <Board columns={['a', 'b', 'c', 'e', 'f', 'g', 'h', 'i', 'j', 'k']} rowsAmount={10} handleOnclick={handleOnclick} isPlayer />
        </>
    );
};

export default Home;
