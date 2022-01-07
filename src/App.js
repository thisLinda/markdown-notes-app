import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import { data } from "./data"
import SplitPane from "./SplitPane"
import {nanoid} from "nanoid"

export default function App() {
    /**
     * to use the localStorage created below to get notes
     * set initial state by accessing `localStorage.get` and getting the item with key of notes
     * because it will be coming back as a stringified value need to parse
     * FYI, if localStorage finds nothing at that key it comes back as null
     */
    const [notes, setNotes] = React.useState(
        // anonymous function at the beginning of the call implicitly returns and results in lazy initialization (without it the app would initialize each time the notes change/will only reach into local storage the first time the app runs)
        () => JSON.parse(localStorage.getItem("notes")) || []
    )
    const [currentNoteId, setCurrentNoteId] = React.useState(
        (notes[0] && notes[0].id) || ""
    )

    /**
     * To interact with localStorage every time the notes array changes need to set up a sideEffect in react with useEffect()
     * useEffect takes 2 parameters, a function and an array
     * the effect will run every time notes changes so notes array is second parameter
     * every time notes changes use `localStorage.setItem()` --using the notes key inside localStorage-- --> `localStorage.setItem("notes")` and use .JSON.stringify to stringify the notes so that the array can be changed to a string and saved in local storage
     */

    React.useEffect(() => {
        localStorage.setItem("notes", JSON.stringify(notes))
    }, [notes])
    
    function createNewNote() {
        const newNote = {
            id: nanoid(),
            body: "# Type your markdown note's title here"
        }
        setNotes(prevNotes => [newNote, ...prevNotes])
        setCurrentNoteId(newNote.id)
    }
    
    function updateNote(text) {
        setNotes(oldNotes => oldNotes.map(oldNote => {
            return oldNote.id === currentNoteId
                ? { ...oldNote, body: text }
                : oldNote
        }))
    }
    
    function findCurrentNote() {
        return notes.find(note => {
            return note.id === currentNoteId
        }) || notes[0]
    }
    
    return (
        <main>
        {
            notes.length > 0 
            ?
            <SplitPane 
                sizes={[30, 70]} 
                direction="horizontal" 
                className="split"
            >
                <Sidebar
                    notes={notes}
                    currentNote={findCurrentNote()}
                    setCurrentNoteId={setCurrentNoteId}
                    newNote={createNewNote}
                />
                {
                    currentNoteId && 
                    notes.length > 0 &&
                    <Editor 
                        currentNote={findCurrentNote()} 
                        updateNote={updateNote} 
                    />
                }
            </SplitPane>
            :
            <div className="no-notes">
                <h1>You have no notes</h1>
                <button 
                    className="first-note" 
                    onClick={createNewNote}
                >
                    Create one now
                </button>
            </div>
            
        }
        </main>
    )
}