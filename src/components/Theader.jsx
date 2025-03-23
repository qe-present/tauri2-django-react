import React from 'react';
import './Theader.css';

const Theader = ({ headers }) => {
  return (
    <thead className="theader">
      <tr>
        {headers.map(header => (
          <th key={header.key} className="theader-cell">
            {header.label}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default Theader;
