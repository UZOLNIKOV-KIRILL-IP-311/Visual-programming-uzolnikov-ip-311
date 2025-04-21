import React, { useState } from 'react';

const DataSet = ({ headers = [], data = [], renderHeader, renderRow, onSelectionChange }) => {
  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowClick = (index, event) => {
    const ctrl = event.ctrlKey;
    let newSelected;
    const alreadySelected = selectedRows.includes(index);
    if (ctrl) {
      if (alreadySelected) {
        newSelected = selectedRows.filter(i => i !== index);
      } else {
        newSelected = [...selectedRows, index];
      }
    } else {
      newSelected = alreadySelected ? [] : [index];
    }
    setSelectedRows(newSelected);
    if (onSelectionChange) {
      onSelectionChange(newSelected);
    }
  };

  return (
    <table>
      <thead>
        <tr>
          {headers.map((header, i) => (
            <th key={i}>{renderHeader ? renderHeader(header) : header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr
            key={index}
            onClick={(e) => handleRowClick(index, e)}
            style={{ backgroundColor: selectedRows.includes(index) ? '#b3ff9a' : 'transparent' }}
          >
            {Object.values(row).map((value, i) => (
              <td key={i}>{renderRow ? renderRow(value) : value}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataSet;