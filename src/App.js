import React, { useState } from 'react';

const AfterLossesKey = 'AFTER_LOSSES'
const MaxMatchesKey = 'MAX_MATCHES'

function preSession(setAppState, afterLosses, setAfterLosses, maxMatches, setMaxMatches) {
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
            <button className="bg-yellow-400 text-gray-700 text-2xl p-1.5" onClick={e => {
                e.preventDefault()
                localStorage.setItem(AfterLossesKey, afterLosses)
                localStorage.setItem(MaxMatchesKey, maxMatches)
                setAppState('inSession')
            }}>Start session</button>
        </div>
    )
}

function shouldStopSession(afterLosses, maxMatches, records) {
    if (records.length >= maxMatches) {
        return true
    }
    let lossAcc = 0
    for (let i = records.length - 1; i >= 0; --i) {
        if (!records[i]) {
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

function inSession(setAppState, afterLosses, maxMatches, records, setRecords) {
    return (
        <div className="flex flex-col space-y-2">
            <div className="text-lg">You've finished {records.length} matches</div>
            <div className="flex">
                <button className="bg-blue-400 text-gray-700 text-2xl p-1.5 w-1/3" onClick={e => {
                    e.preventDefault()
                    const newRecords = [...records, false]
                    setRecords(newRecords)
                    if (shouldStopSession(afterLosses, maxMatches, newRecords)) {
                        setAppState('afterSession')
                    }
                }}>Loss</button>
                <button className="bg-gray-400 text-gray-700 text-2xl p-1.5 w-1/3" onClick={e => {
                    e.preventDefault()
                    const newRecords = [...records, true]
                    setRecords(newRecords)
                    if (shouldStopSession(afterLosses, maxMatches, newRecords)) {
                        setAppState('afterSession')
                    }
                }}>Draw</button>
                <button className="bg-yellow-400 text-gray-700 text-2xl p-1.5 w-1/3" onClick={e => {
                    e.preventDefault()
                    const newRecords = [...records, true]
                    setRecords(newRecords)
                    if (shouldStopSession(afterLosses, maxMatches, newRecords)) {
                        setAppState('afterSession')
                    }
                }}>Win</button>
            </div>
        </div>
    )
}

function afterSession() {
    return (
        <span className="text-lg">You should stop playing Overwatch</span>
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
    const [records, setRecords] = useState([])

    let content
    if (appState === 'preSession') {
        content = preSession(setAppState, afterLosses, setAfterLosses, maxMatches, setMaxMatches)
    } else if (appState === 'inSession') {
        content = inSession(setAppState, afterLosses, maxMatches, records, setRecords)
    } else {
        content = afterSession()
    }

    return (
        <div className="flex-col">
            <div className="bg-blue-600 bg-opacity-90 h-24 flex justify-center items-center">
                <span className="text-3xl text-gray-100">Stop Overwatch loss spiral</span>
            </div>
            <div className="p-2 flex-auto">
                {content}
            </div>
            <div className="bg-blue-600 bg-opacity-90 text-xs text-gray-200 text-center p-2 space-y-0.5">
                <p>Overwatch is a trademark of Blizzard Entertainment, Inc.</p>
                <p>This website is not affiliated with or endorsed by Blizzard Entertainment, Inc.</p>
            </div>
        </div>
    );
}

export default App;
