import { MongoClient, ObjectId } from 'mongodb'

interface Employee {
  name: string
  position: string
  salary: number
}

export class Employees {
  private uri: string
  private dbName: string
  private client: MongoClient

  constructor(uri: string, dbName: string) {
    this.uri = uri
    this.dbName = dbName
    this.client = new MongoClient(this.uri)
  }

  private async getCollection(): Promise<Mongo.Collection<Employee>> {
    await this.client.connect()
    const db = this.client.db(this.dbName)
    const employees = db.collection<Employee>('employees')
    return employees
  }

  async getEmployees(): Promise<Employee[]> {
    console.log(`Employees.js > getEmployees`)

    const employees = await this.getCollection()
    const res = await employees.find({}).toArray()

    return res.map((employee: Employee) => ({
      id: employee._id.toHexString(),
      name: employee.name,
      position: employee.position,
      salary: employee.salary
    }))
  }

  async addEmployee(employee: Employee): Promise<void> {
    console.log(`Employee.js > addEmployee: ${JSON.stringify(employee)}`)

    const employees = await this.getCollection()
    await employees.insertOne(employee)
  }

  async updateEmployee(id: string, employee: Employee): Promise<boolean> {
    console.log(`Employee.js > updateEmployee: ${JSON.stringify(employee)}`)

    const employees = await this.getCollection()
    const result = await employees.updateOne(
      {
        _id: new ObjectId(id)
      },
      {
        $set: employee
      }
    )
    return result.modifiedCount > 0
  }

  async deleteEmployee(id: string): Promise<boolean> {
    console.log(`Employee.js > deleteEmployee: ${id}`)

    const employees = await this.getCollection()
    const result = await employees.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  }
}
