import React, { useState } from 'react';

const DataSet = ({
  data = [],
  headers = null,
  renderHeader = (header) => <th>{header}</th>,
  renderRow = (item, index) => <td>{JSON.stringify(item)}</td>,
}) => {
  const [selected, setSelected] = useState([]);

  const handleRowClick = (index, event) => {
    const isCtrlPressed = event.ctrlKey;

    if (isCtrlPressed) {
      setSelected((prevSelected) =>
        prevSelected.includes(index)
          ? prevSelected.filter((rowIndex) => rowIndex !== index)
          : [...prevSelected, index]
      );
    } else {
      setSelected((prevSelected) =>
        prevSelected.includes(index) ? [] : [index]
      );
    }
  };

  const getHeaders = () => {
    if (headers) {
      return headers.map(renderHeader);
    } else if (data.length > 0) {
      return Object.keys(data[0]).map((key) => renderHeader(key));
    }
    return [];
  };

  const renderDataRow = (item, index) => {
    return (
      <tr
        key={index}
        className={selected.includes(index) ? 'selected' : ''}
        onClick={(event) => handleRowClick(index, event)}
      >
        {Object.values(item).map((value, colIndex) =>
          renderRow(value, colIndex)
        )}
      </tr>
    );
  };

  return (
    <table className="data-set">
      <thead>
        <tr>{getHeaders()}</tr>
      </thead>
      <tbody>
        {data.map((item, index) => renderDataRow(item, index))}
      </tbody>
    </table>
  );
};

export default DataSet;