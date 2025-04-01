import React from 'react';
import './App.css';
import DataSet from './components/DataSet';

const App = () => {
  const data = [
    { ref: 'afro medusa', dem: 'до 27.11', sum: '2500', stat:'не оплачен', pred: '2000'},
    { ref: 'swag', dem: 'до 22.01', sum: '2000', stat:'не оплачен', pred: '2000'},
    { ref: 'подарю', dem: 'до 8.02', sum: '    ', stat:'оплачен', pred: ''},
    { ref: 'бэнгер', dem: 'до 6.03', sum: '2000', stat:'оплачен', pred: ''},
    { ref: 'сломана', dem: 'до 21.03', sum: '1500', stat:'оплачен', pred: ''},
    { ref: 'бобр', dem: 'до 23.03', sum: '1500', stat:'оплачен', pred: ''},
    { ref: '3 бита', dem: 'до 28.03', sum: '5000', stat:'не оплачен', pred: '5000'},
  ];

  const headers = [
    { key: 'ref', label: 'референс' },
    { key: 'dem', label: 'сроки на демо' },
    { key: 'sum', label: 'сумма оплаты' },
    { key: 'stat', label: 'статус оплаты' },
    { key: 'pred', label: 'предоплата' },
  ];

  return (
    <div className="App">
      <h1>WORK TABLE</h1>
      <DataSet
        data={data}
        headers={headers}
        renderHeader={(header) => <th>{header.label}</th>}
        renderRow={(value, index) => <td>{value}</td>}
      />
    </div>
  );
};

export default App;