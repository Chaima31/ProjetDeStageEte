import React, { createContext, useState } from 'react';


const AppartementContext = createContext();

const AppartementProvider = ({ children }) => {
  const [appartements, setAppartements] = useState([]);
  const [meubles, setMeubles] = useState([]);
  const [locateurs, setLocateurs] = useState([]);

  return (
    <AppartementContext.Provider
      value={{ appartements, setAppartements, meubles, setMeubles, locateurs, setLocateurs }}
    >
      {children}
    </AppartementContext.Provider>
  );
};

export { AppartementContext, AppartementProvider };
