interface Employee {
  id: string
  name: string
  position: string
  salary: string
}

interface Window {
  api: {
    getEmployees: () => Promise<Employee[]>
    saveEmployee: (employee: Omit<Employee, 'id'>) => Promise<void>
    updateEmployee: (id: string, employee: Omit<Employee, 'id'>) => Promise<void>
    deleteEmployee: (id: string) => Promise<void>
  }
}
