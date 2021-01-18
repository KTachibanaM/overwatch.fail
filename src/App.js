import React, { useState } from 'react';

const AfterLossesKey = 'AFTER_LOSSES'
const MaxMatchesKey = 'MAX_MATCHES'

function preSession(setAppState, afterLosses, setAfterLosses, maxMatches, setMaxMatches) {
    return (
        <div className="flex flex-col space-y-1">
            <div className="flex">
                <span>Stop playing Overwatch after </span>
                <input className="bg-yellow-500" type="number" min="1" value={afterLosses} onChange={e => {
                    e.preventDefault()
                    setAfterLosses(e.target.value)
                }}/>
                <span> losses</span>
            </div>
            <div className="flex">
                <span>I will play maximum of </span>
                <input className="bg-yellow-500" type="number" min="1" value={maxMatches} onChange={e => {
                    e.preventDefault()
                    setMaxMatches(e.target.value)
                }}/>
                <span> matches</span>
            </div>
            <button className="bg-yellow-500" onClick={e => {
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
        <div className="flex flex-col space-y-1">
            <div>You've finished {records.length} matches</div>
            <div className="flex">
                <button className="bg-blue-500" onClick={e => {
                    e.preventDefault()
                    const newRecords = [...records, false]
                    setRecords(newRecords)
                    if (shouldStopSession(afterLosses, maxMatches, newRecords)) {
                        setAppState('afterSession')
                    }
                }}>Loss</button>
                <button className="bg-yellow-500" onClick={e => {
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
        <p>You should stop playing Overwatch now</p>
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
        <div>
            <div className="bg-blue-400 h-24">
                <span className="text-2xl text-gray-500">Stop Overwatch loss spiral</span>
            </div>
            <div className="h-72">
                {content}
            </div>
            <div className="bg-blue-400 text-xs text-gray-500">
                <p>Overwatch is a trademark of Blizzard Entertainment, Inc.</p>
                <p>This website is not affiliation with or endorsed by Blizzard Entertainment, Inc.</p>
            </div>
        </div>
    );
}

export default App;
