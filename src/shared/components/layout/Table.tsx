import { Table as AntdTable } from 'antd';
import styled from 'styled-components';
import { colors, fonts } from 'shared/theme';

export const TableLink = styled.span`
  cursor: pointer;
  &:hover {
    color: ${colors.white};
  }
`;

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
    width: 100%;
    border-spacing: 0;
    border-color: #000;
  }
  .ant-table-thead {
    background: ${colors.superDarkGrey};
    tr {
      .ant-table-cell {
        border-top: none;
      }
    }
  }
  .ant-table-row {
    background: ${colors.superLightGrey}22;
    padding: 4px 8px;
    cursor: ${({ clickable }: { clickable?: boolean }) =>
      clickable ? 'pointer' : 'default'};
    &:last-child {
      .ant-table-cell {
        border-bottom: none;
      }
    }
    &:hover {
      background-color: ${({ clickable }: { clickable?: boolean }) =>
        clickable
          ? `${colors.superLightGrey}44`
          : `${colors.superLightGrey}22`};
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
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .ant-table-column-sorter-inner {
    align-self: flex-end;
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
      margin: 0 4px;
      border-radius: 4px;
      cursor: pointer;
      color: ${colors.superLightGrey};
      font-family: ${fonts.Dosis};
      button {
        width: 100%;
        height: 100%;
        border: none;
        border-radius: 4px;
        background: ${colors.superLightGrey}99;
        cursor: pointer;
      }
      a {
        text-decoration: none;
      }
      &:hover {
        background: ${colors.superDarkGrey}99;
      }
    }
  }

  .ant-pagination-item-active {
    background-color: ${colors.superDarkGrey}66;
  }

  .ant-pagination-item-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    .ant-pagination-item-ellipsis {
      display: none;
    }
  }
`;

export default Table;
