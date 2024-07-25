import { useEffect, useState } from 'react'
import personsService from './services/persons'

const Filter = ({ search, handleSearchChange }) => {
  return (
    <>
      <div>
        filter shown with <input name='filtro' value={search} onChange={handleSearchChange} />
      </div>
    </>
  )
}

const PersonForm = ({ addName, newName, newNumber, handleNameChange, handleNumberChange }) => {
  return (
    <form onSubmit={addName}>
      <div>
        name: <input name='nombre' value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input name='numero' value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type='submit'>add</button>
      </div>
    </form>
  )
}

const Persons = ({ filteredPerson, deleteName }) => {
  return (
    <div>
      {
        filteredPerson && filteredPerson.map(
          person => <Names key={person.id} person={person} deleteName={deleteName} />
        )
      }
    </div>
  )
}

const Names = ({ person, deleteName }) => {
  return (
    <div>
      {person.name} {person.number} {' '}
      <button onClick={() => deleteName(person.id, person.name)}>delete me</button>
    </div>
  )
}

const Notification = ({ message, estilo }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={estilo}>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')
  const [filteredPerson, setFilteredPerson] = useState([])
  const [successfulMsg, setSuccessfulMsg] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)

  useEffect(() => {
    personsService
      .getAll()
      .then(initialPersons => {
        console.log('promise fulfilled')
        setPersons(initialPersons)
        setFilteredPerson(initialPersons)
      }).catch(error => {
        console.log('Error calling API', error.message)
        window.alert('Error calling API')
      })
  }, [])

  const addName = (e) => {
    e.preventDefault()
    const nameObject = {
      name: newName,
      number: newNumber,
      id: (persons.length + 1).toString()
    }

    if (persons.some(e => e.name === newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        updatePerson(newName)
        setNewName('')
        setNewNumber('')
      }
    } else {
      if (window.confirm(`Do you want add ${newName} to the list?`)) {
        personsService
          .create(nameObject)
          .then(returnedPersons => {
            setPersons(persons.concat(returnedPersons))
            setFilteredPerson(filteredPerson.concat(returnedPersons))
            setNewName('')
            setNewNumber('')
            setSuccessfulMsg(`${newName} was added to the list`)
            setTimeout(() => {
              setSuccessfulMsg(null)
            }, 5000)
          }).catch(error => {
            console.log('Error creating new person ', error.message)
            window.alert('Error creating new person')
          })
      } else {
        setNewName('')
        setNewNumber('')
      }
    }
  }

  const deleteName = (id, name) => {
    if (window.confirm(`delete ${name}?`)) {
      personsService
        .erase(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          setFilteredPerson(filteredPerson.filter(person => person.id !== id))
        }).catch(error => {
          console.log('Error deleting person ', error.message)
          window.alert('Error deleting person')
        })
    }
  }

  const updatePerson = (name) => {
    const person = persons.find(p => p.name === name)
    const changedPersons = { ...person, number: newNumber }
    const idPerson = person.id

    personsService
      .update(idPerson, changedPersons)
      .then(returnedPerson => {
        setPersons(persons.map(person => person.id !== idPerson ? person : returnedPerson))
        setFilteredPerson(filteredPerson.map(person => person.id !== idPerson ? person : returnedPerson))
        setSuccessfulMsg(`The number of ${name} was updated`)
        setTimeout(() => {
          setSuccessfulMsg(null)
        }, 5000)
      }).catch(error => {
        console.log('Error updating person ', error.message)
        setErrorMsg(`${name} was already deleted from server`)
        setPersons(persons.filter(p => p.id !== idPerson))
        setFilteredPerson(filteredPerson.filter(p => p.id !== idPerson))
      })
  }

  const handleNameChange = (e) => {
    setNewName(e.target.value)
  }

  const handleNumberChange = (e) => {
    setNewNumber(e.target.value)
  }

  const handleSearchChange = (e) => {
    setSearch(e.target.value)

    const filterItems = persons.filter((person) =>
      person.name.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase())
    )
    setFilteredPerson(filterItems)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={successfulMsg} estilo='successful' />
      <Notification message={errorMsg} estilo='error' />
      <Filter
        persons={persons}
        search={search}
        handleSearchChange={handleSearchChange}
      />
      <h2>Add a new</h2>
      <PersonForm
        addName={addName}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons
        filteredPerson={filteredPerson}
        deleteName={deleteName}
      />
    </div>
  )
}

export default App
