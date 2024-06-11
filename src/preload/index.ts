import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { Employees } from '../infra/Employess'
import { DB_NAME, URI } from '../data/mongo'

// Custom APIs for renderer
const api = {}

const employees = new Employees(URI, DB_NAME)
let gotEmployeeCallback
let gotEmployeeUpdatedCallback
let gotDeletedResultCallback

const getEmployees = () => {
  console.log(`mainPreload > getEmployees`)

  employees.getEmployees().then((res) => {
    gotEmployeeCallback(res)
  })
}

const gotEmployees = (callback) => {
  gotEmployeeCallback = callback
}

const saveEmployee = (employee) => {
  console.log(
    `mainPreload > Salary: ${employee.salary}, Name: ${employee.name}, Position: ${employee.position}`
  )
  return employees.addEmployee(employee)
}

const deleteEmployees = (id) => {
  console.log(`mainPreload > Delete : ${id}`)

  employees.deleteEmployee(id).then((res) => {
    gotDeletedResultCallback(res)
  })
}

const gotDeletedResult = (callback) => {
  gotDeletedResultCallback = callback
}

const updateEmployee = (id, emp) => {
  console.log(`mainPreload > upDateEmployee : ${id}`)

  const employee = {
    salary: emp.salary,
    name: emp.name,
    position: emp.position
  }

  employees.updateEmployee(id, employee).then((res) => {
    gotEmployeeUpdatedCallback(res)
  })
}

const gotEmployeeUpdatedResult = (callback) => {
  gotEmployeeUpdatedCallback = callback
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', {
      getEmployees,
      gotEmployees,
      saveEmployee,
      updateEmployee,
      gotEmployeeUpdatedResult,
      gotDeletedResult,
      deleteEmployees
    })
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
