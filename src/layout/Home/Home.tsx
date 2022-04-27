import React, { useEffect, useMemo, useState } from 'react';
import Board from '../../component/board/Board';
import { useAppDispatch, useAppSelector } from '../../hook/reduxHooks';
import { addPlayerShips, addCpuShips, addPlayerHoverState, addPlayerShipFields } from '../../store/board/';
import { addUserName } from '../../store/user/';
import useShipSelection from '../../hook/useShipSelection';
import BoardHelper from '../../helper/BoardHelper';
import CpuBoardHelper from '../../helper/CpuBoardHelper';
import { FieldState } from '../../store/board/interfaces';

import style from './home.module.scss';

const columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
const rows = 10;

const Home = () => {
    const dispatch = useAppDispatch();
    const { playerFields, cpuFields } = useAppSelector((state) => state.board);
    const [playerName, setPlayerName] = useState<string>('');
    const [selectedFields, setSelectedFields] = useState<Record<string, FieldState>>({});
    const [hoverStatus, setHoverStatus] = useState<Record<string, FieldState> | null>(null);
    const { handleOpenSelectionModal, modal, selection, addWarning, shipIsSelected } = useShipSelection();

    const handleHover = (element: string, type: string) => {
        if (typeof selection !== 'string') {
            const helper = new BoardHelper(element);
            const ship = helper.createShip(selection.amountOfFields, selection.position, selection.shipName, { columns, rows });
            const fieldsWantToSelect = ship && Object.keys(ship); // For checking if a field of the ship is previously selected.
            const selected = Object.keys(selectedFields);

            if (ship && fieldsWantToSelect && !helper.areFieldPreviouslySelected(selected, fieldsWantToSelect) && type === 'on') {
                dispatch(addPlayerHoverState({ selected: selectedFields, WantToSelect: ship }));
                setHoverStatus(ship);
            } else if (type === 'off') {
                setHoverStatus(null);
                dispatch(addPlayerHoverState({ selected: selectedFields, WantToSelect: {} }));
            }
        }
    };

    const handleOnclick = (element: string) => {
        if (hoverStatus) {
            const ship = { [hoverStatus[element].ship]: Object.keys(hoverStatus) };
            dispatch(addPlayerShips(ship));
            dispatch(addPlayerShipFields(hoverStatus));
            setSelectedFields((prevState) => ({ ...prevState, ...hoverStatus }));
            shipIsSelected();
            setHoverStatus(null);
        }
    };

    useEffect(() => {
        if (selection === 'No More Ships to select') {
            const helper = new CpuBoardHelper(columns, rows);
            const fields = helper.createBoard();
            dispatch(addCpuShips(fields));
        }
    }, [dispatch, selection]);

    const selectionButton = useMemo(() => {
        if (selection === 'No More Ships to select') {
            return (
                <h5 className={style['container__title--warning']} data-testid='No More Ship'>
                    {addWarning}
                </h5>
            );
        } else {
            return (
                <>
                    <button type='button' className='btn btn-outline-info' onClick={handleOpenSelectionModal} data-testid='Add a Ship'>
                        Add a Ship
                    </button>
                    <h5>{addWarning}</h5>
                </>
            );
        }
    }, [selection, addWarning, handleOpenSelectionModal]);

    const startButton = useMemo(() => {
        // eslint-disable-next-line no-magic-numbers
        const hasFields = (fieldsObject: Record<string, FieldState>) => Object.keys(fieldsObject).length > 0;
        const isReadyToPlay = Boolean(playerName) && hasFields(playerFields) && hasFields(cpuFields); // When user made a choice of ships, ad the name and Cpu ships are set you can start playing.
        return (
            <button
                className={style.container__start__button + ' btn btn-outline-success'}
                type='button'
                disabled={!isReadyToPlay}
                onClick={() => dispatch(addUserName(playerName))}
                data-testid='Start Game'
            >
                START GAME
            </button>
        );
    }, [cpuFields, dispatch, playerFields, playerName]);

    return (
        <div className={style.container} data-testid='home'>
            {modal}
            <div className={style.container__table}>
                {selectionButton}
                <Board columns={columns} rowsAmount={rows} handleOnclick={handleOnclick} handleHover={handleHover} isPlayer />
            </div>
            <div className={style.container__start}>
                {startButton}
                <input
                    data-testid='Add Name input'
                    type='text'
                    className={style.container__start__input + ' form-control'}
                    placeholder='Player Name'
                    onChange={(e) => setPlayerName(e.target.value)}
                />
            </div>
        </div>
    );
};

export default Home;
