import React, { useState, useEffect, FormEvent } from 'react'

interface Employee {
  id: string
  name: string
  position: string
  salary: string
}

export const EmployeeManager: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [name, setName] = useState('')
  const [position, setPosition] = useState('')
  const [salary, setSalary] = useState('')
  const [empId, setEmpId] = useState('')

  useEffect(() => {
    getEmployees()
  }, [])

  const getEmployees = async () => {
    try {
      const response = await window.api.getEmployees()
      setEmployees(response)
    } catch (error) {
      console.error('Failed to fetch employees:', error)
      setEmployees([]) // Ensure employees is an array even if the API call fails
    }
  }

  const saveEmployee = async (event: FormEvent) => {
    event.preventDefault()

    try {
      if (empId === '') {
        await window.api.saveEmployee({ name, position, salary })
      } else {
        await window.api.updateEmployee(empId, { name, position, salary })
      }
      clearForm()
      getEmployees()
    } catch (error) {
      console.error('Failed to save employee:', error)
    }
  }

  const deleteEmployee = async (id: string) => {
    try {
      await window.api.deleteEmployee(id)
      getEmployees()
    } catch (error) {
      console.error('Failed to delete employee:', error)
    }
  }

  const editEmployee = (id: string) => {
    const emp = employees.find((employee) => employee.id === id)
    if (emp) {
      setEmpId(emp.id)
      setName(emp.name)
      setPosition(emp.position)
      setSalary(emp.salary)
    }
  }

  const clearForm = () => {
    setEmpId('')
    setName('')
    setPosition('')
    setSalary('')
  }

  return (
    <section className="section">
      <h1 className="title">Employee Manager</h1>
      <div className="box mt-3">
        <form onSubmit={saveEmployee}>
          <div className="field">
            <label htmlFor="name">Name</label>
            <input
              className="input"
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="position">Position</label>
            <input
              className="input"
              type="text"
              id="position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="salary">Salary</label>
            <input
              className="input"
              type="text"
              id="salary"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
            />
          </div>
          <input type="hidden" id="empId" value={empId} />

          <button className="button is-primary" type="button" onClick={getEmployees}>
            Get Employees
          </button>
          <button className="button is-primary" type="submit">
            Save Employee
          </button>
        </form>
      </div>

      <div className="box mt-3">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Position</th>
              <th>Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees?.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.name}</td>
                <td>{employee.position}</td>
                <td>{employee.salary}</td>
                <td>
                  <button className="button is-danger" onClick={() => deleteEmployee(employee.id)}>
                    Delete
                  </button>
                  <button className="button is-info" onClick={() => editEmployee(employee.id)}>
                    Edit Employee
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default EmployeeManager
