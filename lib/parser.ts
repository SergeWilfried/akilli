import Papa from 'papaparse';

export async function csvParser(file: File) {
  try {
    // Passing file data (event.target.files[0]) to parse using Papa.parse
    let list, columns, filteredValues;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const rowsArray: any = [];
        const valuesArray: any = [];

        // Iterating data to get column name and their values
        results.data.map((d) => {
          rowsArray.push(Object.keys(d));
          valuesArray.push(Object.values(d));
          console.log('valuesArray', Object.values(d));
        });
        list = results.data;
        columns = rowsArray[0];
        rowsArray.map((d) => {
          console.log('code', JSON.stringify(columns)[1]);
          console.log('text', Object.values(d));
        });

        filteredValues = valuesArray;
        console.log('filteredValues', valuesArray);

        return {
          list: results.data,
          columns: rowsArray[0],
          filteredValues: valuesArray,
        };
      },
    });
    return {
      list: list,
      columns: columns,
      filteredValues: filteredValues,
    };
  } catch (error) {
    console.log(error);
    throw new Error('Error in parsing CSV file');
  }
}
