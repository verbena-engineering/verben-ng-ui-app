import { TableStyles } from "verben-ng-ui/src/public-api";


// Default styles
export const white360Style: TableStyles = {
  width: '100%',
  fontFamily: '"Fraunces", serif',
  fontSize: '125%',
  whiteSpace: 'nowrap',
  margin: '0',
  border: '1px solid #D4A007',
  borderRadius: '16px',
  borderCollapse: 'separate',
  borderSpacing: '0',
  tableLayout: 'fixed',
  rows: {
    even: {
      backgroundColor: '#FDFDFD',
    },
    odd: {
      backgroundColor: '#F1F4FB',
    },
    height: '68px',
  },
  cells: {
    padding: '0.5rem 1rem',
  },
  header: {
    stickyTop: true,
    zIndex: 2,
    backgroundColor: '#EFF2FB',
    fontWeight: 'bold',
    textAlign: 'left',
    padding: '12px 16px',
    height: '40px',
  },
  footer: {
    stickyBottom: true,
    zIndex: 2,
    padding: '3px',
  },
  //   body: {
  //     background: '#fff',
  //     padding: '4px 5px',
  //     textAlign: 'center',
  //   },
  firstColumn: {
    stickyLeft: true,
    zIndex: 1,
  },
  lastColumn: {
    stickyRight: true,
    zIndex: 1,
  },
};

// Default styles
export const defaultTableStyles: TableStyles = {
  // borderCollapse: 'collapse',
  position: 'relative',
  borderSpacing: '0px',
  border: '1px solid #D4A007',
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  width: '100%',
  maxHeight: '678px',
  header: {
    backgroundColor: '#ffffff',
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'left',
    padding: '12px 16px',
    borderBottom: '2px solid #e0e0e0',
    position: 'sticky',
    top: '0px',
  },
  rows: {
    even: {
      backgroundColor: '#F7F6FE',
    },
    odd: {
      backgroundColor: '#FFFFFF',
    },
    nth: {
      interval: 5,
      style: {
        backgroundColor: '#f0f0f0',
      },
    },
  },
  cells: {
    padding: '12px 16px',
    borderBottom: '1px solid #e0e0e0',
  },
  footer: {
    backgroundColor: '#f5f5f5',
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'left',
    padding: '12px 16px',
    borderTop: '2px solid #e0e0e0',
  },
};

// Default styles
export const testTableStyles: TableStyles = {
  // borderCollapse: 'collapse',
  position: 'relative',
  borderSpacing: '0px',
  overflow: 'hidden',
  width: '100%',
  maxHeight: '678px',
  fontSize: '14px',
  header: {
    backgroundColor: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'left',
    padding: '12px 16px',
    position: 'sticky',
    top: '0px',
  },
  rows: {
    even: {
      backgroundColor: '#F7F6FE',
    },
    odd: {
      backgroundColor: '#FFFFFF',
    },
  },
  cells: {
    padding: '12px 16px',
    fontWeight: '400',
  },
};

export const stickyTableStyles: TableStyles = {
  fontFamily: '"Fraunces", serif',
  fontSize: '125%',
  whiteSpace: 'nowrap',
  margin: '0',
  border: '1px solid black',
  borderCollapse: 'separate',
  borderSpacing: '0',
  tableLayout: 'fixed',
  cells: {
    border: '1px solid black',
    padding: '0.5rem 1rem',
  },
  header: {
    stickyTop: true,
    zIndex: 1,
    background: 'lightyellow',
    padding: '3px',
  },
  footer: {
    stickyBottom: true,
    zIndex: 1,
    background: 'lightyellow',
    padding: '3px',
  },
  body: {
    background: '#fff',
    padding: '4px 5px',
    textAlign: 'center',
  },
  firstColumn: {
    stickyLeft: true,
    zIndex: 2,
    background: 'lightyellow',
    fontWeight: '100',
    fontStyle: 'italic',
    textAlign: 'left',
  },
  lastColumn: {
    stickyRight: true,
    zIndex: 1,
    background: 'lightyellow',
  },
};
