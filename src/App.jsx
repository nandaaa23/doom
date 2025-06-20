import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [moods, setMoods] = useState([])
  const [selectedMood, setSelectedMood] = useState(null)
  const [note, setNote] = useState('')
  const [currentDate] = useState(new Date().toISOString().split('T')[0])

  const moodOptions = [
    { id: 'excellent', label: 'Excellent', emoji: '😄', color: '#a8e6cf' },
    { id: 'good', label: 'Good', emoji: '🙂', color: '#b8d4e3' },
    { id: 'okay', label: 'Okay', emoji: '😐', color: '#f7d794' },
    { id: 'bad', label: 'Bad', emoji: '😞', color: '#f4a261' },
    { id: 'terrible', label: 'Terrible', emoji: '😭', color: '#e76f51' }
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
        <h1>Mood Tracker</h1>
        <p className="subtitle">Track your daily vibes</p>
      </header>

      <main className="app-main">
        <section className="mood-input-section">
          <h2>How are you feeling today?</h2>
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
              <h3>Add a note (optional)</h3>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What's on your mind?"
                maxLength={200}
                className="note-input"
              />
              <div className="note-counter">{note.length}/200</div>
              <button onClick={saveMood} className="save-button">
                Save Mood
              </button>
            </div>
          )}
        </section>

        <section className="stats-section">
          <h2>Last 7 Days</h2>
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
          <h2>Mood History</h2>
          <div className="mood-history">
            {moods.length === 0 ? (
              <p className="no-moods">No moods tracked yet</p>
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
