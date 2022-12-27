import filter from "lodash/filter";
import isEmpty from "lodash/isEmpty";
import isUndefined from "lodash/isUndefined";

export const flatten = (list = [], parentTitle = "", path = []) => {
  let transferDataSource = [];
  list.forEach(({ children, title, ...rest }, index) => {
    if (!isUndefined(children) && !isEmpty(children)) {
      const childrenDataSource = flatten(
        children,
        parentTitle + "/" + title,
        path + `[${index}].children`
      );
      transferDataSource = [...transferDataSource, ...childrenDataSource];
    } else {
      transferDataSource.push({
        ...rest,
        title: parentTitle + "/" + title,
        key: path + `[${index}]`,
      });
    }
  });
  return transferDataSource;
};

export const getTargetKeys = (columns) => {
  return filter(columns, (col) => col.isHidden);
};
