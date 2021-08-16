import fs from 'fs';
export interface Account {
  [key: string]: string;
};
export interface Transaction {
  [key: string]: string | number;
}

export async function writeToFile(filePath: string, data: Account[]|Transaction[]): Promise<void> {

  fs.writeFile(filePath, JSON.stringify(data, null, ' '), 'utf8', (err: unknown) => {
    if (err) {
      console.log(err);
    }
  });

}
