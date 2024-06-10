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

let getEmployees = () => {
  console.log(`mainPreload > getEmployees`)

  employees.getEmployees().then((res) => {
    gotEmployeeCallback(res)
  })
}

let gotEmployees = (callback) => {
  gotEmployeeCallback = callback
}

let saveEmployee = (employee) => {
  console.log(
    `mainPreload > Salary: ${employee.salary}, Name: ${employee.name}, Position: ${employee.position}`
  )
  return employees.addEmployee(employee)
}

let deleteEmployees = (id) => {
  console.log(`mainPreload > Delete : ${id}`)

  employees.deleteEmployee(id).then((res) => {
    gotDeletedResultCallback(res)
  })
}

let gotDeletedResult = (callback) => {
  gotDeletedResultCallback = callback
}

let updateEmployee = (id, emp) => {
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

let gotEmployeeUpdatedResult = (callback) => {
  gotEmployeeUpdatedCallback = callback
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
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
