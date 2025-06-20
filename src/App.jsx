import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [moods, setMoods] = useState([])
  const [selectedMood, setSelectedMood] = useState(null)
  const [note, setNote] = useState('')
  const [currentDate] = useState(new Date().toISOString().split('T')[0])

  const moodOptions = [
    { id: 'excellent', label: 'EXCELLENT', emoji: '😄', color: '#00ff00' },
    { id: 'good', label: 'GOOD', emoji: '🙂', color: '#87ceeb' },
    { id: 'okay', label: 'OKAY', emoji: '😐', color: '#ffff00' },
    { id: 'bad', label: 'BAD', emoji: '😞', color: '#ffa500' },
    { id: 'terrible', label: 'TERRIBLE', emoji: '😭', color: '#ff0000' }
  ]

  useEffect(() => {
    const savedMoods = localStorage.getItem('moodTrackerData')
    if (savedMoods) {
      setMoods(JSON.parse(savedMoods))
    }
  }, [])

  const saveMood = () => {
    if (!selectedMood) return

    const newMoodEntry = {
      id: Date.now(),
      mood: selectedMood,
      note: note.trim(),
      date: currentDate,
      timestamp: new Date().toISOString()
    }

    const updatedMoods = [...moods, newMoodEntry]
    setMoods(updatedMoods)
    localStorage.setItem('moodTrackerData', JSON.stringify(updatedMoods))
    
    setSelectedMood(null)
    setNote('')
  }

  const deleteMood = (id) => {
    const updatedMoods = moods.filter(mood => mood.id !== id)
    setMoods(updatedMoods)
    localStorage.setItem('moodTrackerData', JSON.stringify(updatedMoods))
  }

  const getMoodStats = () => {
    const last7Days = moods.filter(mood => {
      const moodDate = new Date(mood.date)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return moodDate >= weekAgo
    })

    const moodCounts = moodOptions.reduce((acc, mood) => {
      acc[mood.id] = last7Days.filter(entry => entry.mood.id === mood.id).length
      return acc
    }, {})

    return { last7Days, moodCounts }
  }

  const { last7Days, moodCounts } = getMoodStats()

  return (
    <div className="app">
      <header className="app-header">
        <h1>MOOD TRACKER</h1>
        <p className="subtitle">TRACK YOUR DAILY VIBES</p>
      </header>

      <main className="app-main">
        <section className="mood-input-section">
          <h2>HOW ARE YOU FEELING TODAY?</h2>
          <div className="mood-grid">
            {moodOptions.map((mood) => (
              <button
                key={mood.id}
                className={`mood-button ${selectedMood?.id === mood.id ? 'selected' : ''}`}
                onClick={() => setSelectedMood(mood)}
                style={{ '--mood-color': mood.color }}
              >
                <span className="mood-emoji">{mood.emoji}</span>
                <span className="mood-label">{mood.label}</span>
              </button>
            ))}
          </div>

          {selectedMood && (
            <div className="note-section">
              <h3>ADD A NOTE (OPTIONAL)</h3>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="WHAT'S ON YOUR MIND?"
                maxLength={200}
                className="note-input"
              />
              <div className="note-counter">{note.length}/200</div>
              <button onClick={saveMood} className="save-button">
                SAVE MOOD
              </button>
            </div>
          )}
        </section>

        <section className="stats-section">
          <h2>LAST 7 DAYS</h2>
          <div className="stats-grid">
            {moodOptions.map((mood) => (
              <div key={mood.id} className="stat-item">
                <span className="stat-emoji">{mood.emoji}</span>
                <span className="stat-count">{moodCounts[mood.id]}</span>
                <span className="stat-label">{mood.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="history-section">
          <h2>MOOD HISTORY</h2>
          <div className="mood-history">
            {moods.length === 0 ? (
              <p className="no-moods">NO MOODS TRACKED YET</p>
            ) : (
              moods.slice().reverse().map((moodEntry) => (
                <div key={moodEntry.id} className="mood-entry">
                  <div className="mood-entry-header">
                    <span className="mood-entry-emoji">{moodEntry.mood.emoji}</span>
                    <span className="mood-entry-date">{moodEntry.date}</span>
                    <button
                      onClick={() => deleteMood(moodEntry.id)}
                      className="delete-button"
                    >
                      ✕
                    </button>
                  </div>
                  {moodEntry.note && (
                    <p className="mood-entry-note">{moodEntry.note}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
