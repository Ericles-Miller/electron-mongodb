import { contextBridge, ipcRenderer } from 'electron';
import { Employees } from '../../models/Employees';

const globals = require('../../globals');

const employees = new Employees(globals.URI, globals.DB_NAME);

interface Employee {
  salary: number;
  name: string;
  position: string;
}

// Function callbacks with appropriate types
type GetEmployeesCallback = (employees: Employee[]) => void;
type GotDeletedResultCallback = (result: boolean) => void;
type GotEmployeeUpdatedCallback = (result: boolean) => void;

// Functions with explicit types
const getEmployees: () => Promise<Employee[]> = async () => {
  console.log(`mainPreload > getEmployees`);
  const res = await employees.getEmployees();
  return res;
};

const gotEmployees: (callback: GetEmployeesCallback) => void = (callback) => {
  gotEmployeeCallback = callback;
};

const saveEmployee: (employee: Employee) => Promise<void> = async (employee) => {
  console.log(
    `mainPreload > Salary: ${employee.salary}, Name: ${employee.name}, Position: ${employee.position}`
  );
  await employees.addEmployee(employee);
};

const deleteEmployees: (id: string) => Promise<boolean> = async (id) => {
  console.log(`mainPreload > Delete : ${id}`);
  const res = await employees.deleteEmployee(id);
  return res;
};

const gotDeletedResult: (callback: GotDeletedResultCallback) => void = (callback) => {
  gotDeletedResultCallback = callback;
};

const updateEmployee: (id: string, emp: Employee) => Promise<boolean> = async (id, emp) => {
  console.log(`mainPreload > upDateEmployee : ${id}`);

  const employee: Employee = {
    salary: emp.salary,
    name: emp.name,
    position: emp.position,
  };

  const res = await employees.updateEmployee(id, employee);
  return res;
};

const gotEmployeeUpdatedResult: (callback: GotEmployeeUpdatedCallback) => void = (callback) => {
  gotEmployeeUpdatedCallback = callback;
};

contextBridge.exposeInMainWorld("api", {
  getEmployees,
  gotEmployees,
  saveEmployee,
  updateEmployee,
  gotEmployeeUpdatedResult,
  gotDeletedResult,
  deleteEmployees,
});