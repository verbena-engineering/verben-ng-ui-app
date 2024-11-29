import { TableStyles } from 'verben-ng-ui';

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
