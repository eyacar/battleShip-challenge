/* eslint-disable react/no-unescaped-entities */
import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hook/reduxHooks';
import { addPlayerMove, addCpuMove, clearState } from '../../store/board/';
import { addUserName } from '../../store/user/';
import Board from '../../component/board/Board';

import style from './match.module.scss';

const columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
const rows = 10;

const Match = () => {
    const [isPlayerMove, setIsPlayerMove] = useState<boolean>(true);
    const [winner, setWinner] = useState<string>('');
    const { playerMoves, cpuShips, playerShips } = useAppSelector((state) => state.board);
    const { userName } = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();

    const handleOnclickCpu = (element: string) => {
        const isANewMove = !playerMoves.includes(element);
        if (isPlayerMove && isANewMove) {
            dispatch(addPlayerMove(element));
            setIsPlayerMove(false);
        }
    };

    const handleOnclickPlayer = (element: string) => element;

    useEffect(() => {
        const ships = Object.keys(playerShips);
        let amountOfPlayerShipsLeft = 5;
        let amountOfCpuShipsLeftps = 5;

        for (const ship of ships) {
            // eslint-disable-next-line no-magic-numbers
            if (playerShips[ship].length === 0) {
                amountOfPlayerShipsLeft--;
            }
            // eslint-disable-next-line no-magic-numbers
            if (cpuShips[ship].length === 0) {
                amountOfCpuShipsLeftps--;
            }
        }

        // eslint-disable-next-line no-magic-numbers
        if (amountOfCpuShipsLeftps === 0) {
            setWinner(userName);
        }

        // eslint-disable-next-line no-magic-numbers
        if (amountOfPlayerShipsLeft === 0) {
            setWinner('Cpu');
        }
    }, [cpuShips, playerShips, userName]);

    useEffect(() => {
        const ONE_SECONDS_DELAY = 2000;
        setTimeout(function () {
            if (!isPlayerMove) {
                dispatch(addCpuMove({ columns, rows }));
                setIsPlayerMove(true);
            }
        }, ONE_SECONDS_DELAY);
    }, [dispatch, isPlayerMove]);

    const moveFrom = useMemo(() => {
        const player = isPlayerMove ? userName : 'CPU';
        return (
            <h3 data-testid='playing' className={style.player}>
                Playing: {player}
            </h3>
        );
    }, [isPlayerMove, userName]);

    if (winner)
        return (
            <div className={style.winner}>
                <h1 data-testid='winner' className={style.header}>
                    {winner} WON! <br /> 🏆🏅🎉
                </h1>
                <Link
                    to='/'
                    className='btn btn-outline-primary'
                    data-testid='Re Play'
                    onClick={() => {
                        dispatch(clearState());
                        dispatch(addUserName(''));
                    }}
                >
                    Re Play
                </Link>
            </div>
        );
    return (
        <>
            <h1 className={style.header}>Welcome {userName} Play The Match </h1>

            <div className={style.container}>
                <div>
                    <h4 className={style.header}>PLAYER'S BOARD</h4>

                    <Board columns={columns} rowsAmount={rows} handleOnclick={handleOnclickPlayer} isPlayer />
                </div>
                <div>
                    <h4 className={style.header}>CPU'S BOARD</h4>
                    <Board columns={columns} rowsAmount={rows} handleOnclick={handleOnclickCpu} />
                </div>
            </div>
            {moveFrom}
        </>
    );
};

export default Match;
