import { MongoClient, ObjectId } from 'mongodb';

interface Employee {
  _id?: ObjectId;
  name: string;
  position: string;
  salary: number;
}

export class Employees {
  private dbName: string;
  private client: MongoClient;

  constructor(uri: string, dbName: string) {
    this.uri = uri;
    this.dbName = dbName;
    this.client = new MongoClient(this.uri);
  }

  private async getCollection(): Promise<MongoCollection<Employee>> {
    await this.client.connect();
    const db = this.client.db(this.dbName);
    return db.collection<Employee>('employees');
  }

  async getEmployees(): Promise<Employee[]> {
    console.log('Employees.js > getEmployees');

    const collection = await this.getCollection();
    const employees = await collection.find({}).toArray();
    return employees.map((employee) => ({
      id: employee._id?.toHexString(),
      name: employee.name,
      position: employee.position,
      salary: employee.salary,
    }));
  }

  async addEmployee(employee: Employee): Promise<void> {
    console.log(`Employee.js > addEmployee: ${JSON.stringify(employee)}`); // More informative logging

    const collection = await this.getCollection();
    await collection.insertOne(employee);
  }

  async updateEmployee(id: string, employee: Employee): Promise<boolean> {
    console.log(`Employee.js > updateEmployee: ${JSON.stringify(employee)}`);

    const collection = await this.getCollection();
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: employee }
    );
    return result.modifiedCount === 1;
  }

  async deleteEmployee(id: string): Promise<boolean> {
    console.log(`Employee.js > deleteEmployee: ${id}`);

    const collection = await this.getCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }
}