import styled from 'styled-components';
import { Table as AntdTable } from 'antd';
import { colors } from 'shared/theme';

export const defaultSort = (a: number | string, b: number | string): number => {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
};

const Table = styled(AntdTable)`
  table {
    border-spacing: 0;
    border-color: #000;
  }
  .ant-table-thead {
    background-color: ${colors.superDarkGrey};
    tr {
      .ant-table-cell {
        border-top: none;
      }
    }
  }
  .ant-table-row {
    background-color: ${colors.superLightGrey}22;
    padding: 4px 8px;
    &:last-child {
      .ant-table-cell {
        border-bottom: none;
      }
    }
  }
  .ant-table-cell {
    margin: 0;
    padding: 4px 8px;
    text-align: center;
    border-top: 1px solid ${colors.newMediumGrey};
    border-bottom: 1px solid ${colors.newDark};
    &:first-child {
      padding: 0;
    }
  }

  .ant-table-column-sorters {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .ant-table-column-sorter-inner {
    span {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-left: 4px;
      color: ${colors.darkBlue};
      svg {
        width: 10px;
        height: 10px;
      }
    }
    .active {
      color: ${colors.superLightGrey};
    }
  }

  .ant-pagination {
    list-style-type: none;
    display: flex;
    flex-direction: row;
    margin: 12px 0 0 0;
    padding: 0;
    justify-content: flex-end;
    li {
      display: flex;
      width: 32px;
      height: 32px;
      justify-content: center;
      align-items: center;
      button {
        width: 100%;
        height: 100%;
      }
    }
  }
`;

export default Table;
