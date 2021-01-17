import React, { useState } from 'react';

function preSession(setAppState, afterLosses, setAfterLosses, maxMatches, setMaxMatches) {
    return (
        <div>
            <div style={{
                display: "flex"
            }}>
                <span>Stop playing Overwatch after </span>
                <input type="number" min="1" value={afterLosses} onChange={e => {
                    e.preventDefault()
                    setAfterLosses(e.target.value)
                }}/>
                <span> losses</span>
            </div>
            <div style={{
                display: "flex"
            }}>
                <span>I will play maximum of </span>
                <input type="number" min="1" value={maxMatches} onChange={e => {
                    e.preventDefault()
                    setMaxMatches(e.target.value)
                }}/>
                <span> matches</span>
            </div>
            <button onClick={e => {
                e.preventDefault()
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
        <div>
            <button onClick={e => {
                e.preventDefault()
                const newRecords = [...records, true]
                setRecords(newRecords)
                if (shouldStopSession(afterLosses, maxMatches, newRecords)) {
                    setAppState('afterSession')
                }
            }}>Win</button>
            <button onClick={e => {
                e.preventDefault()
                const newRecords = [...records, false]
                setRecords(newRecords)
                if (shouldStopSession(afterLosses, maxMatches, newRecords)) {
                    setAppState('afterSession')
                }
            }}>Loss</button>
        </div>
    )
}

function afterSession() {
    return (
        <div>
            <p>You should stop playing Overwatch now</p>
        </div>
    )
}

function App() {
    const [appState, setAppState] = useState('preSession')
    const [afterLosses, setAfterLosses] = useState(1)
    const [maxMatches, setMaxMatches] = useState(3)
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
            <header>
                <span>Stop Overwatch loss spiral</span>
            </header>
            <section>
                {content}
            </section>
            <footer>
                <p>overwatch.fail is not associated with Blizzard, etc, etc</p>
            </footer>
        </div>
    );
}

export default App;
