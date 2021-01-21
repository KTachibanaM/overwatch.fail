import React, { useState } from 'react';

const AfterLossesKey = 'AFTER_LOSSES'
const MaxMatchesKey = 'MAX_MATCHES'
const CountDrawAsLossKey = 'COUNT_DRAW_AS_LOSS'

function preSession(setAppState, afterLosses, setAfterLosses, maxMatches, setMaxMatches, countDrawAsLoss,
                    setCountDrawAsLoss) {
    return (
        <div className="flex flex-col space-y-2">
            <div className="flex space-x-2">
                <span>Stop playing after </span>
                <input className="w-16 border-b-2" type="number" min="1" value={afterLosses} onChange={e => {
                    e.preventDefault()
                    setAfterLosses(e.target.value)
                }}/>
                <span> losses</span>
            </div>
            <div className="flex space-x-2">
                <span>Play maximum of </span>
                <input className="w-16 border-b-2" type="number" min="1" value={maxMatches} onChange={e => {
                    e.preventDefault()
                    setMaxMatches(e.target.value)
                }}/>
                <span> matches</span>
            </div>
            <div className="flex space-x-2">
                <span>Count draw as loss </span>
                <input className="w-16 border-b-2" type="checkbox" checked={countDrawAsLoss === 't'} onChange={e => {
                    setCountDrawAsLoss(e.target.checked ? 't' : 'f')
                }}/>
            </div>
            <button className="bg-yellow-400 text-gray-700 text-2xl p-1.5" onClick={e => {
                e.preventDefault()
                localStorage.setItem(AfterLossesKey, afterLosses)
                localStorage.setItem(MaxMatchesKey, maxMatches)
                localStorage.setItem(CountDrawAsLossKey, countDrawAsLoss)
                setAppState('inSession')
            }}>Start session</button>
        </div>
    )
}

function shouldStopSession(afterLosses, maxMatches, countDrawAsLoss, records) {
    if (records.length >= maxMatches) {
        return true
    }
    let lossAcc = 0
    for (let i = records.length - 1; i >= 0; --i) {
        if (records[i] === 'l' || (records[i] === 'd' && countDrawAsLoss === 't')) {
            lossAcc += 1
            if (lossAcc >= afterLosses) {
                return true
            }
        } else {
            lossAcc = 0
        }
    }
    return false
}

function inSession(setAppState, afterLosses, maxMatches, countDrawAsLoss, records, setRecords) {
    return (
        <div className="flex flex-col space-y-2">
            <div className="text-lg">You've finished {records.length} matches</div>
            <div className="flex">
                <button className="bg-blue-400 text-gray-700 text-2xl p-1.5 w-1/3" onClick={e => {
                    e.preventDefault()
                    const newRecords = [...records, 'l']
                    setRecords(newRecords)
                    if (shouldStopSession(afterLosses, maxMatches, countDrawAsLoss, newRecords)) {
                        setAppState('afterSession')
                    }
                }}>Loss</button>
                <button className="bg-gray-400 text-gray-700 text-2xl p-1.5 w-1/3" onClick={e => {
                    e.preventDefault()
                    const newRecords = [...records, 'd']
                    setRecords(newRecords)
                    if (shouldStopSession(afterLosses, maxMatches, countDrawAsLoss, newRecords)) {
                        setAppState('afterSession')
                    }
                }}>Draw</button>
                <button className="bg-yellow-400 text-gray-700 text-2xl p-1.5 w-1/3" onClick={e => {
                    e.preventDefault()
                    const newRecords = [...records, 'w']
                    setRecords(newRecords)
                    if (shouldStopSession(afterLosses, maxMatches, countDrawAsLoss, newRecords)) {
                        setAppState('afterSession')
                    }
                }}>Win</button>
            </div>
        </div>
    )
}

function afterSession(setAppState, setRecords) {
    return (
        <div className="flex flex-col space-y-2">
            <p className="text-lg">You should stop playing Overwatch</p>
            <button className="bg-yellow-400 text-gray-700 text-2xl p-1.5" onClick={e => {
                e.preventDefault()
                setAppState('preSession')
                setRecords([])
            }}>Restart</button>
        </div>
    )
}

function App() {
    const [appState, setAppState] = useState('preSession')
    const [afterLosses, setAfterLosses] = useState(
        window.localStorage.getItem(AfterLossesKey) || 2
    )
    const [maxMatches, setMaxMatches] = useState(
        window.localStorage.getItem(MaxMatchesKey) || 5
    )
    const [ countDrawAsLoss, setCountDrawAsLoss ] = useState(
        window.localStorage.getItem(CountDrawAsLossKey) || 'f'
    )
    const [records, setRecords] = useState([])

    let content
    if (appState === 'preSession') {
        content = preSession(setAppState, afterLosses, setAfterLosses, maxMatches, setMaxMatches, countDrawAsLoss,
            setCountDrawAsLoss)
    } else if (appState === 'inSession') {
        content = inSession(setAppState, afterLosses, maxMatches, countDrawAsLoss, records, setRecords)
    } else {
        content = afterSession(setAppState, setRecords)
    }

    return (
        <div className="flex-col flex h-screen md:w-1/2 m-auto md:border-l-2 md:border-r-2">
            <header className="bg-blue-600 bg-opacity-90 h-24 flex justify-center items-center">
                <span className="text-3xl text-gray-100">Stop Overwatch loss spiral</span>
            </header>
            <main className="p-2 flex-auto">
                {content}
            </main>
            <footer className="bg-blue-600 bg-opacity-90 text-xs text-gray-200 text-center p-2 space-y-0.5">
                <p>Overwatch is a trademark of Blizzard Entertainment, Inc.</p>
                <p>This website is not affiliated with or endorsed by Blizzard Entertainment, Inc.</p>
            </footer>
        </div>
    );
}

export default App;
